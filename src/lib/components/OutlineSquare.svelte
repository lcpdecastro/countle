<script>
  import { scale } from 'svelte/transition';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let { value, used = false, size = "3rem", onclick } = $props();

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

<button disabled={ used } style:--size={ size } { onclick }>
  { #key value }
    <div class="square">
      <div class="text" in:scale={ { duration: 150, easing: cssEaseIn } } out:scale={ { duration: 150, easing: cssEaseIn } } bind:this={ span } style:--text-scale={ textScale }>
        { value }
      </div>
    </div>
  { /key }
</button>

<style>
  canvas {
    display: none;
  }

  button {
    padding: 0;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    border-radius: 30%;
  }

  button:not(:disabled):hover .square {
    background: var(--theme-color-light);
  }

  .square {
    width: var(--size);
    height: var(--size);
    padding: 0.3rem;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    grid-area: 1 / 1 / 2 / 2;
    border: 0.075rem solid var(--theme-color);
    border-radius: 30%;
    backface-visibility: hidden;
    transition-property: background;
    transition-duration: 0.15s;
  }

  .text {
    width: 100%;
    grid-area: 1 / 1 / 2 / 2;
    font-size: calc(var(--size) * 0.5 * var(--text-scale));
    font-weight: bold;
    color: var(--theme-color);
  }
</style>
