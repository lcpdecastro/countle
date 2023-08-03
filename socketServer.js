import express from "express";
import { WebSocketServer } from "ws";

export default function initServer (handler) {
    const app = express();

    const wss = new WebSocketServer({ noServer: true });
    wss.on('connection', socket => {
        if (state.round > 0) {
            socketSend(socket, 'decline-player');
            socket.close();
            return;
        }

        players.push({
            socket,
            username: null,
            ready: false
        });

        socket.on('message', x => handleMessages(socket, JSON.parse(x.toString())));

        socket.on('close', () => {
            let u = players.find(x => x.socket === socket);
            console.log(`[SOCKET SERVER] ${u?.username ?? 'someone'} left`);
            removePlayer(socket)
        });
    });

    app.use(handler);

    const server = app.listen(80);
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, socket => {
            wss.emit('connection', socket, request);
        });
    });
}

/*

==============
LIST OF EVENTS
==============

-> set-username         Client chooses username
<- init-state           Server sends client initial state of game

-> player-ready         Client marks itself ready for game start
<- send-player-list     Server sends player list (inc. ready statuses) to clients

-> [none]
<- start-game           Server sends go-ahead to start game to clients

-> generate-number      Client generates a number (N)
<- pass-number          Server passes generated number to other clients

-> generate-target      Client generates a target (N)
<- pass-target          Server passes generated target to other clients

-> generate-letter      Client generates a letter (L)
<- pass-letter          Server passes generated letter to other clients

-> [none]
<- start-round          Server signals start of round

-> send-score           Client sends computed score to server for reconciling
<- [none]

-> [none]
<- send-scoreboard      Server sends scoreboard to clients

-> get-state            Client asks for game state from server
<- send-state           Server sends state to clients

*/

function socketSend (socket, event, data) {
    socket.send(JSON.stringify({ event, data }));
}

const state = {
    round: 0,
    games: 'llnllnllnlln',
    control: null
};

const players = [];
const scores = {};

function setUsername (socket, username) {
    players.find(p => p.socket === socket).username = username;

    scores[username] = [];

    if (!state.control) state.control = username;

    console.log(`[SOCKET SERVER] ${username} joined`);

    socketSend(socket, 'join-success');
    sendPlayerList();
}

function removePlayer (socket) {
    const i = players.findIndex(x => x.socket === socket);
    const u = players[i].username;

    players.splice(i, 1);
    delete scores[u];
    
    if (players.filter(x => x.username).length === 0) {
        console.log('[SOCKET SERVER] No players remaining.');
        
        state.round = 0;
        state.control = null;
        
        Object.keys(scores).forEach(x => delete scores[x]);
        
        return;
    }
    
    if (state.control === u) state.control = players[i % players.length];
    sendPlayerList();
    sendScores();
    if (!state.round && players.every(p => p.ready)) nextRound();
}

function sendPlayerList () {
    players.forEach(p => socketSend(p.socket, 'send-player-list', players.map(x => { return { username: x.username, ready: x.ready } })));
}

function passNumber (socket, data) {
    players.forEach(p => {
        if (p.socket !== socket) socketSend(p.socket, 'pass-number', data);
    });
}

function passTarget (socket, data) {
    players.forEach(p => {
        if (p.socket !== socket) socketSend(p.socket, 'pass-target', data);
    });
}

function passLetter (socket, data) {
    players.forEach(p => {
        if (p.socket !== socket) socketSend(p.socket, 'pass-letter', data)
    });
}

function receiveScore (socket, data) {
    const player = players.find(x => x.socket === socket);
    player.ready = false;

    scores[player.username].push(data);

    sendPlayerList();
    reconcileScores();
}

function reconcileScores () {
    const r = state.round - 1;

    if (Object.values(scores).every(x => x.length === state.round)) {
        const n = state.games[r] === 'n';

        if (n) {
            players.forEach(p => {
                const s = scores[p.username][r];
                scores[p.username][r] = s === 0 ? 10 : (s >= 1 && s <= 5) ? 7 : (s >= 6 && s <= 10) ? 5 : 0;
            });
        }

        sendScores();
    }
}

function sendScores () {
    players.forEach(p => socketSend(p.socket, 'send-scores', scores));
}

function nextRoundReady (socket) {
    players.find(p => p.socket === socket).ready = true;
    sendPlayerList();
    if (players.every(p => p.ready)) nextRound();
}

function nextRound () {
    if (!state.round && players.length === 3) state.games = "lllnlllnllln";
    
    state.round++;
    state.control = players[(players.findIndex(x => x.username === state.control) + 1) % players.length].username;
    players.forEach(p => socketSend(p.socket, 'next-round', state));
}

// Event handler

function handleMessages (socket, message) {
    const { event, data } = message;

    switch (event) {
        case 'set-username':
            setUsername(socket, data);
            break;
        case 'generate-number':
            passNumber(socket, data);
            break;
        case 'generate-target':
            passTarget(socket, data);
            break;
        case 'generate-letter':
            passLetter(socket, data);
            break;
        case 'send-score':
            receiveScore(socket, data);
            break;
        case 'next-round-ready':
            nextRoundReady(socket);
            break;
    }
}
