<script>
  import { createEventDispatcher } from 'svelte';
  import Row from './Row.svelte';

  const dispatch = createEventDispatcher();

  let { steps, solved = false } = $props();
</script>

<div class="wrapper">
  { #each steps as step, i (step) }
    <Row
      value={ step } solved = { solved && i === steps.length - 1 }
      on:selectnumber={ e => dispatch('selectnumber', e.detail) }
      on:removenumber={ e => dispatch('removenumber', [i, e.detail]) }
      on:removeoperation={ () => dispatch('removeoperation', i) }
      on:removerow={ () => dispatch('removerow', i) }
    />
  { /each }
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
  }
</style>
