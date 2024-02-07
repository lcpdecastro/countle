<script>
  import { scale } from 'svelte/transition';
  import { cssEaseIn } from '$lib/js/cssEase.js';

  let { value, size = "3rem" } = $props();
</script>

<button class="wrapper" style:--size={ size } inert={ value === '=' } on:click>
  { #key value }
    <div in:scale={ { duration: 150, easing: cssEaseIn } } out:scale={ { duration: 150, easing: cssEaseIn } } class="text">
      { value }
    </div>
  { /key }
</button>

<style>
  canvas {
    display: none;
  }

  button {
    padding: 0;
    width: var(--size);
    height: var(--size);
    padding: 0.3rem;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    background: none;
    border: 0.075rem solid var(--theme-color);
    border-radius: 30%;
    backface-visibility: hidden;
    transition-property: background, transform;
    transition-duration: 0.15s;
  }

  button:hover {
    background: var(--theme-color-light);
  }

  .text {
    width: 100%;
    grid-area: 1 / 1 / 2 / 2;
    text-align: center;
    font-size: calc(var(--size) * 0.5);
    font-weight: bold;
    color: var(--theme-color);
  }
</style>
