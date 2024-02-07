<script>
  import { createEventDispatcher } from 'svelte';
  import Square from '../Square.svelte';

  const dispatch = createEventDispatcher();

  let { numbers } = $props();
</script>

<div>
  { #each Array(6) as _, i }
    <Square value={ numbers[i]?.value } used={ numbers[i]?.used } valid={ numbers[i]?.valid } size="3rem" on:click={ () => dispatch('selectnumber', numbers[i]) } />
  { /each }
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
