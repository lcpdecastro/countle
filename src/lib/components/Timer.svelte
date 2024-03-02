<script>
  import { onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  
  import { cssEaseIn } from '$lib/js/cssEase.js';

  let { onTimerDone } = $props();

  let store = tweened(30);
  let donePromise = $state();

  export function start () {
    donePromise = store.set(0, { duration: 30000 });
  }

  export function reset () {
    store.set(30, { duration: 150, easing: cssEaseIn });
  }
  
  export function drain () {
    store.set(0, { duration: 0 });
  }

  export function add (amount) {
    store.set(Math.min(30, $store + amount - 0.15), { duration: 150, easing: cssEaseIn })
    .then(() => donePromise = store.set(0, { duration: $store * 1000 }));
  }

  $effect(() => donePromise?.then?.(onTimerDone));

  onDestroy(drain);
</script>

<div class="wrapper" class:red={ $store <= 5 }>
  <div class="timer">
    <div class="inner" style:transform="translateX({ Math.min((1 - $store / 30) * -100, 0) }%)"/>
  </div>

  <span>{ Math.ceil($store).toString().padStart(2, '0') }</span>
</div>

<style>
  .wrapper {
    width: 100%;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .timer, .inner {
    width: 100%;
    height: 0.5rem;
    border-radius: 0.5rem;
  }

  .timer {
    background: var(--colar-gray-3);
    overflow: hidden;
  }

  .inner {
    background: var(--theme-color);
    transition: background 0.15s;
  }

  .wrapper.red .inner {
    background: var(--colar-red-6);
  }

  span {
    font-size: 1.5rem;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
    color: var(--theme-color);
    transition: color 0.15s;
  }

  .wrapper.red span {
    color: var(--colar-red-6);
  }

  @media (prefers-color-scheme: dark) {
    .timer {
      background: var(--colar-gray-10);
    }

    .wrapper.red .inner {
      background: var(--colar-red-5);
    }

    .wrapper.red span {
      color: var(--colar-red-5);
    }
  }
</style>
