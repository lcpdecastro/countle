<script>
    import { fade } from 'svelte/transition';

    import settings from '$lib/js/settings.js';
    import cssEase from '$lib/js/cssEase.js';
    import flip from '$lib/js/flipTransition.js';

    export let value = null;

    let oldValue;
    let displayOldValue;

    $: reducedMotion = $settings['reducedMotion'];
    $: {
        displayOldValue = oldValue;
        oldValue = value;
    }
</script>

<div class="wrapper">
    { #if reducedMotion }
        <div class="main">
            { #if value }
                <span in:fade={ { duration: 150 } }>{ value ?? '' }</span>
            { /if }
        </div>
    { :else }
        { #key value }
            <div class="back" in:flip={ { from: 0, to: 180 } }>{ displayOldValue ?? '' }</div>
            <div class="main" in:flip>{ value ?? '' }</div>
        { /key }
    { /if }
</div>

<style>
    .wrapper {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        width: max-content;
        height: max-content;
    }

    .main, .back {
        width: 12rem;
        height: 7rem;
        grid-area: 1 / 1 / 2 / 2;
        display: grid;
        align-content: center;
        justify-content: center;
        font-size: 4rem;
        border-radius: 2rem;
        background: var(--theme-color);
        font-weight: 900;
        color: white;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transition-property: transform, opacity;
        transition-duration: 0.3s;
    }

    .back {
        transform: rotateX(180deg);
    }
</style>
