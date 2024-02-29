<script>
  import { tweened } from 'svelte/motion';

  import { cssEaseIn } from '$lib/js/cssEase.js';

  let { onclick } = $props();

  let countdown = tweened(0);

  export function start () {
    countdown.set(5, { duration: 5000 });
  }

  export function refill () {
    countdown.set(0.15, { duration: 150, easing: cssEaseIn })
    .then(start);
  }

  export function reset () {
    countdown.set(0, { duration: 150, easing: cssEaseIn });
    frozen = false;
  }

  let frozen = $state(false);
  export function freeze () {
    countdown.set($countdown, { duration: 0 });
    frozen = true;
  }
</script>

<div class="wrapper">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" class:frozen>
    <circle cx="50" cy="50" r="50" class="back" />
    <circle cx="50" cy="50" r="25" stroke="var(--theme-color)" stroke-width="50" stroke-dasharray="{ Math.PI * 50 * ($countdown / 5) } { Math.PI * 50 * (1 - ($countdown / 5)) }"/>
  </svg>

  <button class="text-btn" disabled={ $countdown < 5 || frozen } onclick={ () => { refill(); onclick(); } }>
    <span>REROLL</span>
  </button>
</div>

<style>
  .wrapper {
    width: min-content;
    display: flex;
    gap: 1rem;
  }

  svg {
    width: 2rem;
    height: 2rem;
    align-self: center;
    transform: rotate(-90deg);
    transition-property: filter, opacity;
    transition-duration: 0.15s;
  }

  svg.frozen {
    filter: grayscale(1);
    opacity: 0.5;
  }
  
  .back {
    fill: var(--colar-gray-3);
  }

  button {
    width: min-content;
    align-self: center;
    justify-self: center;
  }

  @media (prefers-color-scheme: dark) {
    .back {
      fill: var(--colar-gray-10);
    }
  }
</style>
