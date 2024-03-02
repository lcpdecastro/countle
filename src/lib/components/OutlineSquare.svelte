<script>
  import { onMount } from 'svelte';

  import { scale } from 'svelte/transition';
  import { cssEaseIn } from '$lib/js/cssEase.js';

  let { data, size = "3rem", onclick } = $props();

  let value = $derived(data?.value);

  let span = $state();
  let containerWidth = $state();

  let textScale = $state(1);
  
  $effect(() => {
    if (!value) return;
    new FontFace('Work Sans', 'url(https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2)').load().then(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      ctx.font = `bold calc(${size} * 0.5) "Work Sans"`;
      const m = ctx.measureText(value);
      const textWidth = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;

      textScale = Math.min(1, containerWidth / textWidth);
    });
  });

  onMount(() => containerWidth = parseFloat(getComputedStyle(span).width));
</script>

<button style:--size={ size } { onclick }>
  { #key data }
    <div class="square">
      <div class="text" in:scale={ { duration: 150, easing: cssEaseIn } } out:scale={ { duration: 150, easing: cssEaseIn } } bind:this={ span } style:--text-scale={ textScale }>
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
    border: var(--border-width) solid var(--theme-color);
    border-radius: 30%;
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
