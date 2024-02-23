<script>
  import Square from '$lib/components/Square.svelte';

  let { numbers, onSelectNumber } = $props();
</script>

<div>
  { #each Array(6) as _, i }
    <Square data={ numbers[i] } size="3rem"
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
