<script>
  import { onMount } from 'svelte';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let score = $state(0);

  export function reset () {
    score = 0;
  }

  export function add (x = 1) {
    score += x;
  }

  let container = $state();
  let containerWidth = $state();

  let canvas = $state();
  let textScale = $state(1);
  
  $effect(() => {
    new FontFace('Work Sans', 'url(https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2)').load().then(() => {
      const ctx = canvas.getContext('2d');

      ctx.font = 'bold 2rem "Work Sans"';
      const m = ctx.measureText(score.toLocaleString());
      const textWidth = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;
      
      textScale = Math.min(1, containerWidth / textWidth);
    });
  });

  onMount(() => containerWidth = parseFloat(getComputedStyle(container).width));
</script>

<canvas bind:this={ canvas } style:display="none" />

<div class="wrapper" bind:this={ container }>
  <div class="score-wrapper">
    { #key score }
      <div class="score" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <div class="score-text" style:--text-scale={ textScale }>
          { score.toLocaleString() }
        </div>
      </div>
    { /key }
  </div>
  <div class="subtitle">SCORE</div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .score-wrapper {
    display: grid;
    align-items: center;
    justify-items: center;
  }
  
  .score, .subtitle {
    font-weight: bold;
    color: var(--theme-color);
    line-height: 100%;
  }

  .subtitle {
    font-size: 0.75rem;
  }
  
  .score {
    grid-area: 1 / 1 / 2 / 2;
    font-size: 2rem;
    font-variant-numeric: tabular-nums;
    backface-visibility: hidden;
  }
  
  .score-text {
    transform: scale(var(--text-scale));
  }
</style>
