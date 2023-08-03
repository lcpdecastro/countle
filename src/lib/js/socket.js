import { writable } from "svelte/store";

import { browser } from "$app/environment";

const socket = browser ? (() => {
    const u = new URL(document.URL);
    u.protocol = 'ws';

    const ws = new WebSocket(u.origin);

    ws.addEventListener('message', e => {
        const { event, data } = JSON.parse(e.data);
        callbacks[event]?.(data);
    });

    return ws;
})() : null;

export function socketSend (event, data = null) {
    if (socket && socket.readyState === 1) socket.send(JSON.stringify({ event, data }));
}

export function socketListen (event, callback) {
    callbacks[event] = callback;
}

export function socketClose () {
    socket?.close();
}

let socketState = writable(socket?.readyState ?? 0);

socket?.addEventListener('open', () => socketState.set(socket.readyState));
socket?.addEventListener('close', () => socketState.set(socket.readyState));
socket?.addEventListener('error', () => socketState.set(socket.readyState));

export { socketState };

const callbacks = {};
