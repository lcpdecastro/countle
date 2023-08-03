<script>
    import { LucideX } from "lucide-svelte";

    export let open = false;

    let modal;

    $: if (modal && open) modal.showModal();
</script>

<dialog bind:this={ modal } on:close={ () => open = false } on:cancel={ () => open = false }>
    <div class="back" on:click={ () => modal.close() }></div>
    <div class="main">
        <button class="close" on:click={ () => modal.close() }><LucideX size="100%" absoluteStrokeWidth={ true } /></button>
        <slot />
        <button class="ok" on:click={ () => modal.close() }>OK</button>
    </div>
</dialog>

<style>
    dialog {
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: none;
        margin: 0;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        display: grid;
        background: none;
        border: none;
        outline: none;
    }

    dialog:not([open]) {
        display: none;
    }

    .back, .main {
        grid-area: 1 / 1 / 2 / 2;
        align-self: center;
        justify-self: center;
    }

    .back {
        width: 100%;
        height: 100%;
        background: hsla(0, 0%, 0%, 0.5);
    }

    .main {
        max-width: max(calc(100% - 4rem), 50%);
        max-height: max(calc(100% - 8rem), 50%);
        padding: 1.5rem;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-radius: 1.5rem;
        background: white;
        overflow: auto;
    }

    .close {
        width: 2rem;
        height: 2rem;
        padding: 0;
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: hsla(0, 0%, 0%, 0.5);
        transition-property: color, stroke-width;
        transition-duration: 0.15s;
    }

    .close:hover, .close:focus {
        color: var(--red);
        stroke-width: 2px;
        border-radius: 0.5rem;
    }

    .close:focus {
        outline: 2px solid var(--red);
        outline-offset: 0.125rem;
    }

    .ok {
        width: max-content;
        margin-left: auto;
        padding: 0.5rem 0.7rem;
        border: 1px solid currentColor;
        border-radius: 0.75rem;
        outline-offset: 0.125rem;
        font-weight: bold;
        font-size: 1rem;
        color: var(--theme-color);
        transition-property: color, background;
        transition-duration: 0.15s;
    }

    .ok:hover, .ok:focus {
        background: var(--theme-color);
        outline: 1px solid var(--theme-color);
        color: white;
    }
</style>