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
    $running = true;

    timer.start().then(() => {
      $running = false;
      $done = true;

      $daily['letters'] = game.getGameState();
    });
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

  $effect(() => {
    return () => {
      if ($running) $daily['letters'] = game.getGameState();
    };
  });
</script>

<Timer duration={ 30 } bind:this={ timer } />

<Letters
  on:startgame={ () => startGame() }
  bind:this={ game }
/>
