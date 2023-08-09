<script>
    import { createEventDispatcher } from "svelte";
    import { fly, scale, fade } from "svelte/transition";
    
    import settings from "$lib/js/settings.js";
    import cssEase from "$lib/js/cssEase.js";

    const dispatch = createEventDispatcher();

    export let value;
    export let operands;
    export let alt = false;

    $: [a, b] = operands;

    let reducedMotion = $settings['reducedMotion'];

    function buttonTransition (node) {
        if (reducedMotion) return () => { return { duration: 150, css: '' } };
        return scale(node, { duration: 150, opacity: 1 });
    }

    function wheelTransition (node, { x, y }) {
        if (reducedMotion) return fade(node, { duration: 150, easing: cssEase });
        return fly(node, { duration: 150, easing: cssEase, x, y });
    }
</script>

<div class="wrapper">
    { #if value }
        <button transition:fade={ { duration: 150, easing: cssEase } } on:click={ () => dispatch('removeoperation') }>
            <span in:buttonTransition out:buttonTransition>{ value }</span>
        </button>
    { :else if alt }
        <div class="wheel">
            <button
                type="button"
                on:click={ () => dispatch('selectoperation', '\u002b') }
                in:wheelTransition={ { x: '-50%', y: '-50%' } }
                out:wheelTransition={ { x: '-50%', y: '-50%' } }
            >&plus;</button>
            <button
                type="button"
                on:click={ () => dispatch('selectoperation', '\u2212') }
                disabled={ a === 1 || a <= b || a === b * 2 }
                in:wheelTransition={ { x: '50%', y: '-50%' } }
                out:wheelTransition={ { x: '50%', y: '-50%' } }
            >&minus;</button>
            <button
                type="button"
                on:click={ () => dispatch('selectoperation', '\u00d7') }
                disabled={ a === 1 || b === 1 }
                in:wheelTransition={ { x: '-50%', y: '50%' } }
                out:wheelTransition={ { x: '-50%', y: '50%' } }
            >&times;</button>
            <button
                type="button"
                on:click={ () => dispatch('selectoperation', '\u00f7') }
                disabled={ a === 1 || b === 1 || a % b || a === b ** 2 }
                in:wheelTransition={ { x: '50%', y: '50%' } }
                out:wheelTransition={ { x: '50%', y: '50%' } }
            >&divide;</button>
        </div>
    { /if }
</div>

<style>
    .wrapper {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
    }

    .wrapper > * {
        grid-area: 1 / 1 / 2 / 2;
    }

    .wheel {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: repeat(2, 1fr);
    }

    button {
        width: 100%;
        height: 100%;
        display: grid;
        align-content: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--theme-color);
        overflow: hidden;
        transition-property: background, color, filter, opacity, border;
        transition-duration: 0.15s;
    }

    @media (hover: hover) {
        button:hover {
            border: 1px solid var(--theme-color);
            background: var(--theme-color);
            color: white;
        }
    }
    
    button:focus {
        border: 1px solid var(--theme-color);
        outline: none;
        background: var(--theme-color);
        color: white;
    }

    button:disabled {
        filter: grayscale(1);
        opacity: 0.25;
    }

    .wheel button {
        font-size: 1.25rem;
    }
    
    .wheel button:nth-child(1) {
        padding: 0.0625rem 0 0 0.0625rem;
    }

    .wheel button:nth-child(2) {
        padding: 0.0625rem 0.0625rem 0 0;
    }

    .wheel button:nth-child(3) {
        padding: 0 0 0.0625rem 0.0625rem;
    }

    .wheel button:nth-child(4) {
        padding: 0 0.0625rem 0.0625rem 0;
    }
</style>
