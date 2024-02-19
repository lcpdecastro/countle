<script>
  import X from 'lucide-svelte/icons/x';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';
  
  import Square from '../Square.svelte';
  import OutlineSquare from '../OutlineSquare.svelte';
  import Operation from './Operation.svelte';

  let { value, solved = false, onRemoveNumber, onRemoveOperation, onSelectNumber, onRemoveRow } = $props();
</script>

<div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
  <OutlineSquare value={ value?.a?.value }
    onclick={ () => onRemoveNumber('a') }
  />

  <Operation value={ value?.o }
    onclick={ onRemoveOperation }
  />

  <OutlineSquare value={ value?.b?.value }
    onclick={ () => onRemoveNumber('b') }
  />

  <Operation value="=" />

  <Square value={ value?.c?.value } used={ value?.c?.used } valid={ value?.c?.valid } { solved }
    onclick={ () => onSelectNumber(value.c) }
  />
  
  <button
    onclick={ onRemoveRow }
  >
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
    background: var(--colar-red-0);
  }
</style>
