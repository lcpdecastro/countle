<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import daily from '$lib/js/daily.js';

  import Timer from '$lib/components/Timer.svelte';
  import Letters from '$lib/components/letters/Letters.svelte';

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

  let dailyApplied = $state(false);

  $effect(() => {
    if (!dailyApplied) {
      if ($daily['letters']) {
        game.applyGameState($daily['letters']);
        $done = true;
        timer.drain();
      }
    }

    dailyApplied = true;
  });

  function forfeit () {
    if ($running) $daily['letters'] = game.getGameState();
  }

  $effect(() => forfeit);
</script>

<svelte:window onbeforeunload={ forfeit } />

<Timer duration={ 30 } bind:this={ timer }
  onTimerDone={ () => {
    $running = false;
    $done = true;
    $daily['letters'] = game.getGameState();
  } }
/>

<Letters
  onStartGame={ startGame }
  bind:this={ game }
/>
