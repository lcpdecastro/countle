<script>
    import Numbers from '$lib/components/numbers/Numbers.svelte';
    import Letters from '$lib/components/letters/Letters.svelte';
    import Timer from '$lib/components/Timer.svelte';
    import Settings from '$lib/components/Settings.svelte';
    import Lobby from '$lib/components/Lobby.svelte';
    import Landing from '$lib/components/Landing.svelte';
    import Scoreboard from '$lib/components/Scoreboard.svelte';

    import gameState, { resetLetters, soloState, totalScore } from '$lib/js/stores.js';
    import { socketSend, socketListen, socketClose, socketState } from '$lib/js/socket.js';

    // ==========#==========#==========#========== //

    export let solo = false;

    // ==========#==========#==========#========== //

    let timerComponent;
    let timerDone;

    let gameComponent;

    let username;
    let scoreboard = false;

    let players;
    let scores;

    let declined = false;

    // ==========#==========#==========#========== //

    function sendUsername () {
        socketSend('set-username', username);
    }

    function joinLobby () {
        entered = true;
    }

    function declinePlayer () {
        declined = true;
    }

    function getPlayerList (x) {
        players = x;
    }

    function sendScore (x) {
        socketSend('send-score', gameComponent.getScore());
    }

    function showScoreboard () {
        scoreboard = true;
    }

    function getScores (x) {
        scores = x;
    }

    function nextRound (x) {
        scoreboard = false;
        $gameState = x;
        timerComponent.reset();
    }

    function nextRoundReady () {
        socketSend('next-round-ready');
    }

    function soloReset () {
        timerComponent.reset();
        gameComponent.reset();
        resetLetters();
    }

    // ==========#==========#==========#========== //

    if (!solo) {
        socketListen('join-success', () => joinLobby());
        socketListen('decline-player', () => declinePlayer());
        socketListen('send-player-list', x => getPlayerList(x));
        socketListen('send-scores', x => getScores(x));
        socketListen('next-round', x => nextRound(x));
    } else {
        socketClose();
    }

    // ==========#==========#==========#========== //

    $: currentGame = $gameState?.games[$gameState.round - 1] ?? null;

    $: {
        void $soloState;
        timerComponent?.reset();
        if ($soloState === 'l') resetLetters();
    }

    $: entered = !!players?.find(x => x.username === username);
    $: started = !!$gameState?.round;
    $: $totalScore = scores?.[username].reduce((p, c) => p + c, 0) || $totalScore;
</script>

<div class="upper">
    <Settings />
    
    <Timer bind:this={ timerComponent } bind:done={ timerDone }
        on:timerdone={ () => !solo && sendScore() }
    />
</div>

{ #if !solo && declined }
    <div class="message">
        <span>A game is currently in progress.</span>
        <span>Please wait until the current game is finished, then try joining again.</span>
    </div>
{ :else if !solo && $socketState === 3 && started }
    <div class="message">
        <span>You have been disconnected from the lobby.</span>
    </div>
{ :else if !solo && !entered }
    <Landing
        bind:username
        on:submit={ e => sendUsername(e.detail) }
    />
{ :else if !solo && entered && !started }
    <Lobby { username } { players }
        on:playerready={ nextRoundReady }
    />
{ :else if !solo && scoreboard }
    <Scoreboard { scores } { username } ready={ players.find(x => x.username === username).ready }
        on:nextround={ nextRoundReady }
    />
{ :else }
    <svelte:component this={ (currentGame || $soloState) === 'l' ? Letters : Numbers } bind:this={ gameComponent } { solo } control={ $gameState?.control === username ?? null } { timerDone }
        on:starttimer={ timerComponent.start }
        on:showscoreboard={ showScoreboard }
        on:soloreset={ soloReset }
    />
{ /if }

<style>
    :root {
        --theme-color: var(--blue);
    }

    .upper {
        width: 100%;
        height: max-content;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .message {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        align-content: center;
        font-style: italic;
    }
</style>
