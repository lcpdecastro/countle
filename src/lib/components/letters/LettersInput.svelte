<script>
    import { createEventDispatcher } from "svelte";
    import IconBackspace from 'phosphor-svelte/lib/Backspace';
    import IconTrash from 'phosphor-svelte/lib/Trash';
    import IconCheck from 'phosphor-svelte/lib/Check';
    import IconX from 'phosphor-svelte/lib/X';

    import dictionary from '$lib/js/dictionary.js';

    const dispatch = createEventDispatcher();

    export let word;

    $: displayWord = word.reduce((p, c) => `${p}${c.value}`, '');
    $: invalid = !dictionary.has(displayWord.toLowerCase());
</script>

<div class="wrapper" class:empty={ !word.length } class:nine={ word.length === 9 } class:invalid>
    <span class="word-status" style:color={ invalid ? 'var(--red)' : 'var(--green)' }>
        <svelte:component this={ word.length === 0 ? null : invalid ? IconX : IconCheck } size="100%" />
    </span>
    <div class="word">
        { displayWord || '\u00a0' }
    </div>
    <button type="button" class="backspace" disabled={ !word.length } on:click={ () => dispatch('backspace') }>
        <IconBackspace size="100%" />
    </button>
    <button type="button" class="clear" disabled={ !word.length } on:click={ () => dispatch('clear') }>
        <IconTrash size="100%" />
    </button>
</div>

<style>
    .wrapper {
        width: 100%;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        border-bottom: 1px solid currentColor;
        color: var(--theme-color);
        transition-property: filter, opacity, color, border-color;
        transition-duration: 0.15s;
    }

    .wrapper.empty {
        filter: grayscale(1);
        opacity: 0.5;
    }

    .wrapper.nine {
        color: var(--green);
    }

    .wrapper.invalid {
        color: var(--red);
    }

    .word-status {
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
    }

    .word {
        width: 100%;
        padding: 0.25rem;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
    }

    button {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0 0.25rem;
        padding: initial;
        flex-shrink: 0;
        display: flex;
        border-radius: 0.5rem;
        color: var(--theme-color);
        outline-offset: 0.25rem;
    }
    
    .clear {
        color: var(--red);
    }

    button:focus {
        outline: 1px solid var(--theme-color);
    }

    .clear:focus {
        outline-color: var(--red);
    }

    button:disabled {
        pointer-events: none;
    }
</style>
