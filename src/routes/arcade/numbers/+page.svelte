<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Timer from '$lib/components/Timer.svelte';
  import ArcadeNumbers from '$lib/components/arcade/ArcadeNumbers.svelte';

  let timer = $state();
  let game = $state();

  const running = writable(false);
  setContext('running', running);
  
  const done = writable(false);
  setContext('done', done);

  function startGame () {
    timer.start();
    $running = true;
  }

  function resetGame () {
    timer.reset();
    $done = false;
  }
</script>

<Timer duration={ 30 } bind:this={ timer }
  onTimerDone={ () => {
    $running = false;
    $done = true;
  } }
/>

<ArcadeNumbers
  onStartGame={ startGame }
  onResetGame={ resetGame }
  onSolve={ diff => timer.add((diff - 2) * 5) }
  bind:this={ game }
/>

<style>
  .wrapper {
    width: 100%;
    display: flex;
    gap: 1rem;
  }
</style>
