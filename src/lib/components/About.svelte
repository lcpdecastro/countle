<script>
    import Modal from '$lib/components/Modal.svelte';
    import Title from '$lib/components/Title.svelte';

    let open = false;
</script>

<button on:click={ () => open = true }>
    <h1>COUNTLE</h1>
</button>

<Modal bind:open>
    <svelte:fragment slot="title">About</svelte:fragment>

    <div class="modal-body" slot="body">
        <Title />

        <p>
            A recreation of the British game show <i>Countdown</i>, with a daily mode inspired by <i>Wordle</i>.
        </p>
        <p>
            Not related to the similarly-named <a href="https://countle.org">Countle.org</a>, which also features a daily Numbers game.
        </p>
        <p>
            Special thanks to <a href="http://wordlist.aspell.net/">SCOWL and Friends</a> and <a href="https://phosphoricons.com/">Phosphor Icons</a>.
        </p>

        <h2>Countle Legacy</h2>
        <p>
            This version of Countle is a reworked version of the original, which is now <a href="https://github.com/lcpdecastro/countle-legacy">archived on GitHub</a> but can still be accessed <a href="https://countle-legacy.vercel.app">here</a>.
        </p> 
        <p>
            Note that the legacy version of Countle has a faulty Numbers solver which fails to find solutions to some otherwise solvable puzzles, an issue which is fixed in this new version.
        </p>
    </div>
</Modal>

<style>
    button {
        padding: initial;
        border-radius: 0.5rem;
    }

    button:focus, button:active {
        text-decoration: underline;
        outline: none;
    }

    button > h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        line-height: 1.25;
    }

    .modal-body > p ~ h2 {
        margin: 1rem 0 0 0;
    }

    .modal-body > p {
        margin: 0;
        line-height: 1.5;
    }
</style>
