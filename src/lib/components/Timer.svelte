<script>
    import { createEventDispatcher } from "svelte";
    import { tweened } from "svelte/motion";

    import settings from "$lib/js/settings.js";
    import cssEase from '$lib/js/cssEase.js';

    const dispatch = createEventDispatcher();

    export let duration = 30;
    export let done = false;
    
    export function start () {
        value.set(0).then(() => {
            done = true;
            dispatch('timerdone')
        });
    }
    
    export function reset () {
        done = false;
        value.set(duration, { duration: $settings['reducedMotion'] ? 0 : 150, easing: cssEase });
    }

    export function drain () {
        value.set(0, { duration: 0 }).then(() => {
            done = true;
            dispatch('timerdone');
        });
    }

    let value = tweened(duration, { duration: duration * 1000 });
</script>

<div class:red={ $value <= 5 }>
    <div class="timer">
        <div style:right={ `${100 * ((duration - $value) / duration)}%` }></div>
    </div>
    <span>{ duration <= 60 ? `${Math.ceil($value)}`.padStart(`${duration}`.length, '0') : `${Math.floor(Math.ceil($value) / 60)}:${`${Math.ceil($value) % 60}`.padStart(2, '0')}` }</span>
</div>

<style>
    div {
        width: 100%;
        display: flex;
        gap: 1rem;
        font-variant-numeric: tabular-nums;
        align-items: center;
    }

    .timer {
        height: 0.5rem;
        flex-grow: 1;
        flex-basis: 0;
        background: hsl(0, 0%, 0%, 20%);
        overflow: hidden;
    }
    
    .timer > div {
        width: 100%;
        height: 100%;
        position: relative;
        background: var(--theme-color);
        transition: background 0.15s;
    }
    
    .timer, .timer > div {
        border-radius: 0.5rem;
    }
    
    .red .timer > div {
        background: var(--red);
    }
    
    span {
        flex-shrink: 0;
        flex-basis: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--theme-color);
        transition: color 0.15s;
    }
    
    .red span {
        color: var(--red);
    }
</style>
