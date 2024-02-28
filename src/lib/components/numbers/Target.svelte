<script>
  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let { value } = $props();
</script>

<div class="wrapper">
  { #key value }
    <div class="main" in:flip={ { duration: 300, easing: cssEaseIn }} out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 }}>
      { value }
    </div>
  { /key }
</div>

<style>
  .wrapper {
    display: grid;
    align-self: center;
    grid-area: 1 / 2 / 2 / 3;
  }

  .main {
    width: 12rem;
    height: 7rem;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    grid-area: 1 / 1 / 2 / 2;
    border-radius: 2rem;
    background: var(--theme-color);
    font-size: 4rem;
    font-weight: 900;
    color: white;
    backface-visibility: hidden;
  }
</style>
