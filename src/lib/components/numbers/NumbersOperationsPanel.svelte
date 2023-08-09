<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let operands;
    export let disabled;

    $: [a, b] = operands;
</script>

<div inert={ disabled }>
    <button
        type="button"
        disabled={ disabled }
        on:click={ () => dispatch('selectoperation', '\u002b') }
    >&plus;</button>
    <button
        type="button"
        disabled={ disabled || a === 1 || a <= b || a === b * 2 }
        on:click={ () => dispatch('selectoperation', '\u2212') }
    >&minus;</button>
    <button
        type="button"
        disabled={ disabled || a === 1 || b === 1 }
        on:click={ () => dispatch('selectoperation', '\u00d7') }
    >&times;</button>
    <button
        type="button"
        disabled={ disabled || a === 1 || b === 1 || a % b || a === b ** 2 }
        on:click={ () => dispatch('selectoperation', '\u00f7') }
    >&divide;</button>
</div>

<style>
    div {
        align-self: center;
        display: grid;
        grid-template-rows: 3rem;
        grid-template-columns: repeat(4, 3rem);
        gap: 0.5rem;
    }

    button {
        width: 100%;
        height: 100%;
        border: 1px solid currentColor;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        align-items: center;
        justify-items: center;
        border-radius: 30%;
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
</style>
