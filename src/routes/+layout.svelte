<script>
    import '$lib/css/style.css';

    import { page } from '$app/stores';

    import gameState, { soloState, totalScore } from '$lib/js/stores.js';
</script>

<header>
    <div>
        <h1>COUNTLE</h1>
        { #if $gameState }
            <span>ROUND { $gameState.round } / { $gameState.games.length }</span>
            <span>SCORE: <b>{ $totalScore }</b></span>
        { :else if $page.url.pathname.endsWith('/solo') }
            <span class="buttons">
                <button type="button" class:active={ $soloState === 'l' } on:click={ () => $soloState = 'l' }>LETTERS</button>
                <button type="button" class:active={ $soloState === 'n' } on:click={ () => $soloState = 'n' }>NUMBERS</button>
            </span>
        { /if }
    </div>
</header>

<main>
    <slot />
</main>

<style>
    :root {
        --theme-color: var(--blue);
    }

    header {
        width: 100%;
        height: max-content;
        padding: 1rem;
        position: sticky;
        top: 0;
        display: grid;
        align-items: center;
        justify-items: center;
        background: var(--theme-color);
        color: white;
        z-index: 1;
    }

    header > div {
        width: 23rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    header > div > h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    header > div > span {
        margin-left: auto;
    }

    header > div > .buttons {
        display: flex;
        gap: 0.5rem;
    }

    header > div > .buttons > button {
        padding: 0.25rem 0.45rem;
        border-radius: 0.5rem;
        transition-property: background, color;
        transition-duration: 0.1s;
    }

    header > div > .buttons > button.active,
    header > div > .buttons > button:hover,
    header > div > .buttons > button:focus {
        background: white;
        color: var(--theme-color);
    }

    header > div > .buttons > button.active {
        font-weight: bold;
    }

    main {
        width: 23rem;
        height: min-content;
        padding: 1rem 0;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
</style>
