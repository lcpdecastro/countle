<script>
  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  let score = $state(0);

  export function reset () {
    score = 0;
  }

  export function add () {
    score++;
  }
</script>

<div class="wrapper">
  <div class="score-wrapper">
    { #key score }
      <span class="score" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>{ score }</span>
    { /key }
  </div>
  <span>SOLVED</span>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
  }

  .score-wrapper {
    display: grid;
    align-items: center;
    justify-items: center;
  }

  span {
    grid-area: 1 / 1 / 2 / 2;
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--theme-color);
    line-height: 100%;
    backface-visibility: hidden;
  }
  
  .score {
    font-size: 2rem;
    font-variant-numeric: tabular-nums;
  }
</style>
