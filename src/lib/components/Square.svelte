<script>
    import { fade } from "svelte/transition";

    import settings from '$lib/js/settings.js';
    import cssEase from '$lib/js/cssEase.js';
    import flip from '$lib/js/flipTransition.js';

    export let value = null;
    export let disabled = false;
    export let valid = true;
    export let shortcut = null;

    let oldValue;
    let displayOldValue;

    $: reducedMotion = $settings['reducedMotion'];
    $: invalidClass = value && !valid;
    $: {
        displayOldValue = oldValue;
        oldValue = value;
    }
</script>

<button type="button" { disabled } inert={ !value || !valid } class:invalid={ invalidClass } on:click>
    { #if $settings['numbersShortcuts'] && value && shortcut }
        <div transition:fade={ { duration: 150 } } class="shortcut">
            { shortcut ?? '' }
        </div>
    { /if }

    { #if reducedMotion }
        <div style:--font-scale={ Math.min(1, 2 / ((1.5 + `${value ?? ''}`.length) / 2)) } class="main">
            { #if value }
                <span in:fade={ { duration: 150 } }>{ value ?? '' }</span>
            { /if }
        </div>
    { :else }
        { #key value }
            <div style:--font-scale={ Math.min(1, 2 / ((1.5 + `${displayOldValue ?? ''}`.length) / 2)) } class="back" in:flip={ { from: 0, to: 180 } }>{ displayOldValue ?? '' }</div>
            <div style:--font-scale={ Math.min(1, 2 / ((1.5 + `${value ?? ''}`.length) / 2)) } class="main" in:flip>{ value ?? '' }</div>
        { /key }
    { /if }
</button>

<style>
    :root {
        --font-size: 1.5rem;
        --font-scale: 1;
    }

    button {
        width: 100%;
        height: 100%;
        padding: 0;
        position: relative;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        align-items: center;
        justify-items: center;
        font-weight: bold;
        color: white;
        transition-property: transform, filter, opacity;
        transition-duration: 0.15s;
    }

    button.invalid {
        opacity: 0.25;
    }

    button:disabled {
        transform: scale(0.8);
        filter: grayscale(1);
        opacity: 0.5;
    }

    @media (hover: hover) {
        button:hover {
            transform: scale(1.1) rotate(2.5deg);
        }
    }
    
    button:focus {
        transform: scale(1.1) rotate(2.5deg);
    }

    button, .main, .back {
        border-radius: calc(100% / 3);
    }

    .shortcut {
        padding: 0.15rem 0.3rem;
        position: absolute;
        top: -0.375rem;
        left: -0.375rem;
        background: var(--theme-color);
        border-radius: 0.5rem;
        font-size: 0.875rem;
        z-index: 1;
        transition: background 0.15s;
    }

    .main, .back {
        width: 100%;
        height: 100%;
        grid-area: 1 / 1 / 2 / 2;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        align-items: center;
        justify-items: center;
        background: var(--theme-color);
        font-size: calc(var(--font-size) * var(--font-scale));
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transition: background 0.15s;
    }

    .back {
        transform: rotateX(180deg);
    }

    .invalid .main, .invalid .back, .invalid .shortcut {
        background: var(--red);
    }
</style>
