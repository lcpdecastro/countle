<script>
  import Dialog from '$lib/components/Dialog.svelte';
  import Logo from '$lib/components/Logo.svelte';

  let dialog = $state();
</script>

<Dialog bind:this={ dialog }>
  { #snippet title() }
    About
  { /snippet }

  { #snippet body() }
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
      Repository on <a href="https://github.com/lcpdecastro/countle">GitHub</a>.
    </p>
  { /snippet }
</Dialog>

<button onclick={ dialog.open }>
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
