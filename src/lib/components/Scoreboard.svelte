<script>
    import confetti from 'canvas-confetti';
    import { createEventDispatcher } from "svelte";

    import gameState from '$lib/js/stores.js';

    export let scores;
    export let username;
    export let ready;

    const dispatch = createEventDispatcher();

    function sorter (a, b) {
        let o = scores[a].reduce((p, c) => p + c, 0) - scores[b].reduce((p, c) => p + c, 0);
        if (!o) return a.localeCompare(b);
        return -o;
    }

    $: console.log(Object.entries(scores).map(x => [x[0], x[1].reduce((p, c) => p + c, 0)]).reduce((p, c) => c[1] > p[1] ? c : p)[0] === username);
    $: if (lastRound && Object.entries(scores).map(x => [x[0], x[1].reduce((p, c) => p + c, 0)]).reduce((p, c) => c[1] > p[1] ? c : p)[0] === username) {
        confetti();
    }

    $: lastRound = $gameState.round === $gameState.games.length;
</script>

<div class="wrapper">
    <h1>Scoreboard</h1>

    { #if scores }
        <div class="scoreboard">
            { #each Object.keys(scores).sort(sorter) as player }
                <div class="player" class:self={ player === username }>
                    <div>
                        <div>{ player }</div>
                        <div>{ scores[player].reduce((p, c) => p + c, 0) }</div>
                    </div>

                    <div class="scores">
                        { #each Array($gameState.games.length) as _, i }
                            <div>{ scores[player]?.[i] ?? (i + 1 === $gameState.round ? '\u2026' : '') }</div>
                        { /each }
                    </div>
                </div>
            { /each }
        </div>
    { :else }
        <div class="wait">Please wait&hellip;</div>
    { /if }

    { #if !lastRound }
        <button on:click={ () => dispatch('nextround') } disabled={ ready }>{ ready ? 'WAIITNG FOR OTHER PLAYERS\u2026' : 'NEXT ROUND' }</button>
    { /if }
</div>

<style>
    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h1 {
        margin: 0;
    }
    
    .scoreboard {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .scoreboard > .player {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .scoreboard > .player.self {
        font-weight: bold;
        color: var(--theme-color);
    }

    .scoreboard > .player > div {
        width: 100%;
        padding: 0.25rem 0;
        display: flex;
    }

    .scoreboard > .player > :first-child {
        display: flex;
        font-size: 1.5rem;
        border-bottom: 1px solid hsla(0, 0%, 0%, 0.25);
    }

    .scoreboard > .player.self > :first-child {
        border-color: currentColor;
    }
    
    .scoreboard > .player > :first-child > :last-child {
        margin-left: auto;
    }

    .scoreboard > .player > :last-child {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        justify-items: center;
    }

    button {
        padding: 0.5rem 0.7rem;
        align-self: center;
        border: 1px solid currentColor;
        border-radius: 0.75rem;
        color: var(--theme-color);
        font-weight: bold;
        transition-property: background, color, filter, opacity;
        transition-duration: 0.15s;
    }
    
    button:hover, button:focus {
        background: var(--theme-color);
        color: white;
    }

    button:focus {
        outline: 1px solid var(--theme-color);
        outline-offset: 0.125rem;
    }

    button:disabled {
        filter: grayscale(1);
        opacity: 0.5;
        pointer-events: none;
    }
</style>
