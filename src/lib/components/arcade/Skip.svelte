<script>
  import { getContext } from 'svelte';
  import { tweened } from 'svelte/motion';

  import { cssEaseIn } from '$lib/js/cssEase.js';

  let { onclick } = $props();

  let running = getContext('running');
  let done = getContext('done');

  let countdown = tweened(-100);

  export function start () {
    countdown.set(0, { duration: 5000 });
  }

  export function refill () {
    countdown.set(-100, { duration: 0 })
    .then(start);
  }

  export function reset () {
    countdown.set(-100, { duration: 150, easing: cssEaseIn });
  }

  $effect(() => {
    if ($done) countdown.set($countdown, { duration: 0 });
  });
</script>

<div class="wrapper">
  <button class="text-btn" disabled={ $countdown < 0 || !$running || $done } { onclick }>
    <span>SKIP</span>
  </button>
  <div class="countdown" class:frozen={ $done }>
    <div class="inner" style:transform="translateX({ $countdown }%)" />
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
</style>
