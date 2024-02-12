<script>
  import Dialog from './Dialog.svelte';
  import Logo from './Logo.svelte';

  let dialog = $state();
</script>

<Dialog bind:this={ dialog }>
  <svelte:fragment slot="title">
    About
  </svelte:fragment>

  <svelte:fragment slot="body">
    <Logo />

    <p>
      A recreation of the British game show <i>Countdown</i>, with a daily mode inspired by <i>Wordle</i>.
    </p>
    <p>
      Not related to the similarly named <a href="https://countle.org">countle.org</a>, which also features a daily Numbers game.
    </p>
    <p>
      Made with <a href="https://kit.svelte.dev">SvelteKit</a>.
      American English dictionary from <a href="http://wordlist.aspell.net/">SCOWL and Friends</a>.
      Icons from <a href="https://lucide.dev">Lucide</a>.
      Color palette from <a href="https://github.com/fchristant/colar">Colar</a>.
    </p>
  </svelte:fragment>
</Dialog>

<button on:click={ dialog.open }>
  <h1>COUNTLE</h1>
</button>

<style>
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  button:focus {
    text-decoration: underline;
    text-underline-offset: 0.25rem;
    outline: none;
  }

  p {
    margin: 0;
  }
</style>
