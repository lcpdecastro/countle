<script>
  import Square from '../Square.svelte';

  let { numbers, onSelectNumber } = $props();
</script>

<div>
  { #each Array(6) as _, i }
    <Square value={ numbers[i]?.value } used={ numbers[i]?.used } valid={ numbers[i]?.valid } size="3rem"
      onclick={ () => onSelectNumber(numbers[i]) }
    />
  { /each }
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
