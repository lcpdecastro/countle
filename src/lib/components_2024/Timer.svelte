<script>
  import { tweened } from "svelte/motion";

  let { duration } = $props();

  const store = tweened(duration, { duration: duration * 1000 });

  export async function start () {
    return store.set(0);
  }

  export async function reset () {
    return store.set(duration, { duration: 150 });
  }
</script>

<div class="wrapper" class:red={ $store <= 5 }>
  <div class="timer">
    <div class="inner" style:transform="translateX({ (1 - $store / duration) * -100 }%)"/>
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
    background: lightgray;
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
</style>
