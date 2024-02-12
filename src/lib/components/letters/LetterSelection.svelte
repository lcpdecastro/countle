<script>
  import { createEventDispatcher } from 'svelte';

  import Square from '../Square.svelte';

  const dispatch = createEventDispatcher();

  let { value } = $props();
</script>

<div class="wrapper">
  <div class="letters">
    { #each Array(9) as _, i }
      <Square size="5rem" value={ value?.[i]?.value } used={ value?.[i]?.used } on:click={ () => dispatch('selectletter', value[i]) } />
    { /each }
  </div>
</div>

<style>
  .wrapper {
    align-self: center;
  }

  .letters {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
</style>
