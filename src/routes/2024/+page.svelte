<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Timer from '$lib/components_2024/Timer.svelte';
  import Numbers from '$lib/components_2024/numbers/Numbers.svelte';

  let timer = $state();

  const running = writable(false);
  setContext('running', running);
  
  const done = writable(false);
  setContext('done', done);

  function startGame () {
    $running = true;

    timer.start().then(() => {
      $running = false;
      $done = true;
    });
  }

  function resetGame () {
    timer.reset()
    $done = false;
  }
</script>

<Timer duration={ 30 } bind:this={ timer } />

<Numbers
  on:startgame={ () => startGame() }
  on:resetgame={ () => resetGame() }
/>
