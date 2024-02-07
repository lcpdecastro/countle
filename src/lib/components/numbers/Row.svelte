<script>
  import { createEventDispatcher } from 'svelte';

  import X from 'phosphor-svelte/lib/X';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';
  
  import Square from '../Square.svelte';
  import OutlineSquare from '../OutlineSquare.svelte';
  import Operation from './Operation.svelte';

  const dispatch = createEventDispatcher();

  let { value, solved = false } = $props();
</script>

<div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
  <OutlineSquare value={ value?.a?.value } on:click={ () => dispatch('removenumber', 'a') } />
  <Operation value={ value?.o } on:click={ () => dispatch('removeoperation') } />
  <OutlineSquare value={ value?.b?.value } on:click={ () => dispatch('removenumber', 'b') } />
  <Operation value="=" />
  <Square value={ value?.c?.value } used={ value?.c?.used } valid={ value?.c?.valid } on:click={ () => dispatch('selectnumber', value.c) } { solved } />
  
  <button on:click={ () => dispatch('removerow') }>
    <X color="var(--colar-red-6)" size="calc(1.25rem * 0.6)" weight="bold" />
  </button>
</div>

<style>
  .wrapper {
    display: flex;
    gap: 0.5rem;
    backface-visibility: hidden;
  }

  button {
    padding: 0;
    width: 1.25rem;
    height: 1.25rem;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    align-self: center;
    border: 0.075rem solid var(--colar-red-6);
    border-radius: 50%;
    transition-property: background;
    transition-duration: 0.15s;
  }

  button:hover {
    background: var(--colar-red-0);
  }
</style>
