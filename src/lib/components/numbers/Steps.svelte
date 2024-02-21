<script>
  import Row from './Row.svelte';

  let { steps, solved = false, onSelectNumber, onRemoveNumber, onRemoveOperation, onRemoveRow } = $props();
</script>

<div class="wrapper">
  { #each steps as step, i (step) }
    <Row
      data={ step } solved = { solved && i === steps.length - 1 }
      onSelectNumber={ x => onSelectNumber(x) }
      onRemoveNumber={ x => onRemoveNumber(i, x) }
      onRemoveOperation={ () => onRemoveOperation(i) }
      onRemoveRow={ () => onRemoveRow(i) }
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
