<script>
  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let { value, used = false, valid = true, size = "3rem", solved = false } = $props();

  let canvas = $state();
  let span = $state();

  let textScale = $state(1);
  let scaleInit = $state(false);

  let invalid = $derived(valid === false);

  $effect(() => {
    void value;
    scaleInit = false;
  });

  $effect(() => {
    if (!scaleInit) {
      const ctx = canvas.getContext('2d');

      ctx.font = `bold calc(${size} * 0.5) "Work Sans"`;
      const m = ctx.measureText(value);
      const textWidth = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;

      const n = span.getBoundingClientRect();
      let containerWidth = n.width;
      if (used) containerWidth /= 0.9;

      textScale = Math.min(1, containerWidth / textWidth);
      scaleInit = true;
    }
  });

</script>

<canvas bind:this={ canvas } />

<button disabled={ used === true } inert={ invalid } style:--size={ size } on:click>
  { #key value }
    <div in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } } class="square" class:invalid class:solved>
      <div class="text" bind:this={ span } style:--text-scale={ textScale }>
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
    transition-property: transform, filter, opacity, background;
    transition-duration: 0.15s;
  }

  button:not(:disabled):hover {
    transform: scale(1.1);
  }

  button:disabled {
    filter: grayscale(1);
    transform: scale(0.9);
    opacity: 0.5;
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
    background: var(--theme-color);
    border-radius: 30%;
    backface-visibility: hidden;
    transition-property: background, opacity;
    transition-duration: 0.15s;
  }

  .square.invalid {
    background: var(--colar-red-6);
    opacity: 0.5;
  }

  .square.solved {
    background: var(--colar-green-6);
  }

  .text {
    width: 100%;
    text-align: center;
    font-size: calc(var(--size) * 0.5 * var(--text-scale));
    font-weight: bold;
    color: white;
  }
</style>
