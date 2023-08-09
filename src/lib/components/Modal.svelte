<script>
    import IconCross from 'phosphor-svelte/lib/X';

    export let open = false;

    let modal;

    $: if (modal && open) modal.showModal();
</script>

<dialog bind:this={ modal } on:close={ () => open = false } on:cancel={ () => open = false }>
    <div class="back" on:click={ () => modal.close() }></div>
    <div class="main">
        <div class="title">
            <h1>
                <slot name="title" />
            </h1>
            <button type="button" class="close" on:click={ () => modal.close() }>
                <IconCross size="100%" />
            </button>
        </div>

        <div class="body">
            <slot name="body" />
        </div>

        <div class="bottom">
            <button type="button" class="ok" on:click={ () => modal.close() }>OK</button>
        </div>
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
        grid-template-rows: 100%;
        grid-template-columns: 100%;
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
        width: fit-content;
        max-width: min(calc(100% - 4rem), 60rem);
        height: fit-content;
        max-height: min(calc(100% - 8rem), 48rem);
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: 1.5rem;
        background: white;
    }

    .title {
        padding: 1.5rem;
        display: flex;
    }

    .title > h1 {
        margin: 0;
    }

    .bottom {
        padding: 1rem 1.5rem;
        display: flex;
    }

    .body {
        padding: 1rem 1.5rem;
        position: relative;
        border-top: 1px solid hsla(0, 0%, 0%, 0.2);
        border-bottom: 1px solid hsla(0, 0%, 0%, 0.2);
        overflow-y: auto;
    }

    .close {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: auto;
        align-self: start;
        padding: initial;
        align-self: center;
        color: hsla(0, 0%, 0%, 0.5);
        outline-offset: 0.125rem;
        transition-property: color;
        transition-duration: 0.15s;
    }

    .close:hover, .close:focus {
        color: var(--red);
        border-radius: 0.5rem;
    }

    .close:focus {
        outline: 1px solid var(--red);
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
        transition-property: color, background, border;
        transition-duration: 0.15s;
    }

    @media (hover: hover) {
        .ok:hover {
            border: 1px solid var(--theme-color);
            background: var(--theme-color);
            color: white;
        }
    }

    .ok:focus {
        border: 1px solid var(--theme-color);
        background: var(--theme-color);
        outline: 1px solid var(--theme-color);
        color: white;
    }
</style>