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
  <button class="text-btn" disabled={ $countdown < 5 || frozen } onclick={ () => { refill(); onclick(); } }>
    <span>SKIP</span>
  </button>
  <div class="countdown" class:frozen>
    <div class="inner" style:transform="translateX({ (1 - ($countdown / 5)) * -100 }%)" />
  </div>
</div>

<style>
  .wrapper {
    width: min-content;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  button {
    width: min-content;
    align-self: center;
    justify-self: center;
    color: var(--theme-color);
  }

  .countdown, .inner {
    height: 0.25rem;
    border-radius: 0.25rem;
    background: var(--colar-gray-3);
  }

  .countdown {
    overflow: hidden;
    transition-property: filter, opacity;
    transition-duration: 0.15s;
  }

  .countdown.frozen {
    filter: grayscale(1);
    opacity: 0.5;
  }

  .inner {
    background: var(--theme-color);
  }

  @media (prefers-color-scheme: dark) {
    .countdown {
      background: var(--colar-gray-10);
    }
  }
</style>
