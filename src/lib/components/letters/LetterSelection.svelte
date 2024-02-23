<script>
  import Square from '$lib/components/Square.svelte';

  let { letters, onSelectLetter } = $props();
</script>

<div class="wrapper">
  <div class="letters">
    { #each Array(9) as _, i }
      <Square data={ letters[i] } size="5rem"
        onclick={ () => onSelectLetter(letters[i]) }
      />
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
