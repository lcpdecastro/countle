<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Timer from '$lib/components/Timer.svelte';
  import Letters from '$lib/components/letters/Letters.svelte';

  let timer = $state();

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

<Letters
  onStartGame={ startGame }
  onResetGame={ resetGame }
/>
