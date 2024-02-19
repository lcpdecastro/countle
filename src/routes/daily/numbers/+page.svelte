<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import daily from '$lib/js/daily.js';

  import Timer from '$lib/components/Timer.svelte';
  import Numbers from '$lib/components/numbers/Numbers.svelte';

  let timer = $state();
  let game = $state();

  const running = writable(false);
  setContext('running', running);
  
  const done = writable(false);
  setContext('done', done);

  function startGame () {
    $running = true;

    timer.start().then(() => {
      $running = false;
      $done = true;

      $daily['numbers'] = game.getGameState();
    });
  }

  let dailyApplied = $state(false);

  $effect(() => {
    if (!dailyApplied) {
      if ($daily['numbers']) {
        game.applyGameState($daily['numbers']);
        $done = true;
        timer.drain();
      }
    }

    dailyApplied = true;
  });

  function forfeit () {
    if ($running) $daily['numbers'] = game.getGameState();
  }

  $effect(() => forfeit);
</script>

<svelte:window on:beforeunload={ forfeit } />

<Timer duration={ 30 } bind:this={ timer } />

<Numbers
  onStartGame={ startGame }
  onStoreSolutions={ x => $daily['numbers']['solutions'] = x }
  bind:this={ game }
/>
