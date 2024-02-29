<script>
  import X from 'lucide-svelte/icons/x';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';
  
  import Square from '$lib/components/Square.svelte';
  import OutlineSquare from '$lib/components/OutlineSquare.svelte';
  import Operation from '$lib/components/numbers/Operation.svelte';

  let { data, solved = false, onRemoveNumber, onRemoveOperation, onSelectNumber, onRemoveRow } = $props();
</script>

<div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
  <OutlineSquare data={ data?.a } onclick={ () => onRemoveNumber('a') } />

  <Operation value={ data?.o } onclick={ onRemoveOperation } />

  <OutlineSquare data={ data?.b } onclick={ () => onRemoveNumber('b') } />

  <Operation value="=" />

  <Square data={ data?.c } { solved } onclick={ () => onSelectNumber(data.c) } />
  
  <button onclick={ onRemoveRow } >
    <X size="100%" strokeWidth="0.075rem" color="var(--colar-red-6)" />
  </button>
</div>

<style>
  .wrapper {
    display: flex;
    gap: 0.5rem;
    backface-visibility: hidden;
  }

  button {
    padding: 0.05rem;
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
    background: var(--colar-red-1);
  }

  @media (prefers-color-scheme: dark) {
    button:hover {
      background: var(--colar-red-12);
    }
  }
</style>
