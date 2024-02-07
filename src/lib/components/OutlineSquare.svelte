<script>
  import { scale } from 'svelte/transition';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let { value, used = false, size = "3rem" } = $props();

  let canvas = $state();
  let span = $state();

  let textScale = $state(1);

  $effect(() => {
    const ctx = canvas.getContext('2d');

    ctx.font = `bold calc(${size} * 0.5) "Work Sans"`;
    const m = ctx.measureText(value);
    const textWidth = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;

    const n = span.getBoundingClientRect();
    const containerWidth = n.width;

    textScale = Math.min(1, containerWidth / textWidth);
  });
</script>

<canvas bind:this={ canvas } />

<button disabled={ used } style:--size={ size } on:click>
  { #key value }
    <div 
    <div class="text" bind:this={ span } in:scale={ { duration: 150, easing: cssEaseIn } } out:scale={ { duration: 150, easing: cssEaseIn } } style:--text-scale={ textScale }>
      { value }
    </div>
  { /key }
</button>

<style>
  canvas {
    display: none;
  }

  button {
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
    transition-property: transform, filter, opacity, background;
    transition-duration: 0.15s;
  }

  button:not(:disabled):hover {
    background: var(--theme-color-light);
  }

  .text {
    width: 100%;
    grid-area: 1 / 1 / 2 / 2;
    font-size: calc(var(--size) * 0.5 * var(--text-scale));
    font-weight: bold;
    color: var(--theme-color);
  }
</style>
