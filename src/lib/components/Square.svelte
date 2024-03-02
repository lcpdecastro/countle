<script>
  import { onMount } from 'svelte';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let { data, size = "3rem", solved, onclick } = $props();

  let value = $derived(data?.value);
  let used = $derived(data?.used);
  let invalid = $derived(data?.valid === false);

  let span = $state();
  let containerWidth = $state();

  let canvas = $state();
  let textScale = $state(1);

  $effect(() => {
    if (!value) return;
    
    new FontFace('Work Sans', 'url(https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2)').load().then(() => {
      const ctx = canvas.getContext('2d');
      
      ctx.font = `bold calc(${size} * 0.5) "Work Sans"`;
      const m = ctx.measureText(value);
      const textWidth = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;

      textScale = Math.min(1, containerWidth / textWidth);
    });
  });

  onMount(() => containerWidth = parseFloat(getComputedStyle(span).width));
</script>

<canvas bind:this={ canvas } style:display="none" />

<button disabled={ used === true } inert={ invalid } style:--size={ size } { onclick }>
  { #key data }
    <div in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } } class="square" class:invalid class:solved>
      <div class="text" bind:this={ span } style:--text-scale={ textScale }>
        { value }
      </div>
    </div>
  { /key }
</button>

<style>
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
    overflow: hidden;
  }

  button:not(:disabled):hover {
    transform: scale(1.1);
  }

  button:disabled {
    filter: grayscale(1);
    transform: scale(0.9);
    opacity: 0.5;
  }

  button.computing {
    transition-duration: 0s;
    transform: none;
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

  @media (prefers-color-scheme: dark) {
    .text {
      color: var(--colar-gray-12);
    }

    .square.invalid {
      background: var(--colar-red-5);
    }

    .square.solved {
      background: var(--colar-green-4);
    }
  }
</style>
