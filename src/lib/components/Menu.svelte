<script>
    import IconMenu from 'phosphor-svelte/lib/List';

    import { page } from '$app/stores';

    export let open = false;

    let modal;

    $: if (modal && open) modal.showModal();
</script>

<button type="button" class="menu" on:click={ () => open = true }>
    <IconMenu size="100%" />
</button>

<dialog bind:this={ modal } on:close={ () => open = false } on:cancel={ () => open = false }>
    <div class="back" on:click={ () => modal.close() }></div>
    <div class="main">
        <span>DAILY</span>
        <a on:click={ () => modal.close() } class:current={ $page.url.pathname === '/daily/letters' } href="/daily/letters">LETTERS</a>
        <a on:click={ () => modal.close() } class:current={ $page.url.pathname === '/daily/numbers' } href="/daily/numbers">NUMBERS</a>

        <div style:height="0" />

        <span>INFINITE</span>
        <a on:click={ () => modal.close() } class:current={ $page.url.pathname === '/infinite/letters' } href="/infinite/letters">LETTERS</a>
        <a on:click={ () => modal.close() } class:current={ $page.url.pathname === '/infinite/numbers' } href="/infinite/numbers">NUMBERS</a>
    </div>
</dialog>

<style>
    button {
        padding: initial;
        margin-left: auto;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.5rem;
        outline-offset: 0.25rem;
    }

    button:focus {
        outline: 1px solid currentColor;
    }

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
        min-width: 15rem;
        width: 20%;
        height: 100%;
        padding: 1rem;
        position: absolute;
        right: 0;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        background: var(--theme-color);
        color: white;
        overflow: auto;
    }

    .main > span {
        padding: 0.675rem 0.5rem;
        border-bottom: 1px solid white;
        font-size: larger;
        font-weight: bold;
    }

    .main > a {
        padding: 0.3rem 0.5rem;
        border-radius: 0.5rem;
        color: inherit;
        text-decoration: none;
        outline-offset: 0.125rem;
        transition-property: background, color;
        transition-duration: 0.1s;
    }

    @media (hover: hover) {
        .main > a:hover {
            background: white;
            color: var(--theme-color);
        }
    }

    .main > a:focus,
    .main > a:active {
        background: white;
        color: var(--theme-color);
        outline: 1px solid white;
    }
    
    .main > a.current {
        background: white;
        color: var(--theme-color);
        font-weight: bold;
    }
</style>