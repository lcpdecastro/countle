<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let username;
    export let players = [];
</script>

<div class="wrapper">
    <h1>Players</h1>

    <div class="players">
        { #each players as player }
            { @const connecting = !player.username }

            <div class="player" class:self={ username === player.username } class:connecting>
                { #if connecting }
                    <div>Player connecting&hellip;</div>
                { :else }
                    <div>{ player.username }</div>
                    <div class="status" class:ready={ player.ready }>
                        { #if username === player.username && !player.ready }
                            <button type="button" on:click={ () => dispatch('playerready') }>READY?</button>
                        { :else if !player.ready }
                            <span class="not-ready">NOT READY</span>
                        { :else }
                            <span class="ready">READY!</span>
                        { /if }
                    </div>
                { /if }
            </div>
        { :else }
            <span>Please wait&hellip;</span>
        { /each }
    </div>

    <span class="message">Waiting for all players to be ready&hellip;</span>
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
    
    .players {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: 2.5rem;
        gap: 0.5rem;
    }

    .player {
        display: flex;
        font-size: 1.25rem;
        align-items: center;
    }

    .player.connecting {
        color: hsla(0, 0%, 0%, 0.5);
        font-style: italic;
    }

    .player.self {
        font-weight: bold;
    }

    .player > .status {
        margin-left: auto;
    }

    .not-ready, .ready, button {
        font-weight: bold;
        font-size: initial;
    }

    .not-ready {
        color: var(--red);
    }

    .ready {
        color: var(--green);
    }

    button {
        padding: 0.5rem 0.7rem;
        border: 1px solid currentColor;
        border-radius: 0.75rem;
        color: var(--theme-color);
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

    .message {
        font-size: smaller;
        font-style: italic;
        text-align: center;
    }
</style>
