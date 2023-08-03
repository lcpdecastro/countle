<script>
    import { afterUpdate } from 'svelte';

    import { socketState } from '$lib/js/socket.js';

    export let username = '';

    let form;
    let v = false;

    afterUpdate(() => v = !form.checkValidity());

    $: connecting = $socketState === 0;
</script>

<form bind:this={ form } class="wrapper" on:submit>
    <span>What's your name?</span>
    <input type="text" bind:value={ username } autofocus required />
    <button type="submit" disabled={ v || connecting }>{ connecting ? 'CONNECTING\u2026' : 'JOIN LOBBY' }</button>
</form>

<style>
    form {
        display: contents;
    }

    input {
        width: 100%;
        text-align: center;
        font-size: 1.25rem;
        font-weight: bold;
    }

    button {
        padding: 0.5rem 0.7rem;
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
