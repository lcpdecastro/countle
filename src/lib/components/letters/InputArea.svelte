<script>
  import { createEventDispatcher, getContext } from "svelte";

  import dictionary from '$lib/js/dictionary.js';

  import Backspace from "lucide-svelte/icons/delete";
  import Trash from "lucide-svelte/icons/trash-2";

  const dispatch = createEventDispatcher();

  const running = getContext('running');

  let { value = [] } = $props();

  let word = $derived(value.map(x => x.value).join(''));
</script>

<div class="wrapper" class:invalid={ word.length > 0 && (word.length < 3 || !dictionary.has(word.toLowerCase())) } class:full={ word.length === 9 && dictionary.has(word.toLowerCase()) }>
  <div class="word">
    { word || '\u00a0' }
  </div>

  <button class="icon-btn backspace" disabled={ !$running } on:click={ () => dispatch('removeletter') }>
    <Backspace strokeWidth="0.075rem" size="100%" color="var(--theme-color)" />
  </button>
  <button class="icon-btn delete" disabled={ !$running } on:click={ () => dispatch('clearword') }>
    <Trash strokeWidth="0.075rem" size="100%" color="var(--colar-red-6)" />
  </button>
</div>

<style>
  .wrapper {
    width: 100%;
    padding: 0.5rem;
    display: flex;
    gap: 1rem;
    border-bottom: 0.075rem solid var(--theme-color);
    transition-property: border-bottom-color;
    transition-duration: 0.15s;
  }

  .word {
    flex-grow: 1;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    color: var(--theme-color);
    transition-property: color;
    transition-duration: 0.15s;
  }

  .wrapper.full {
    border-bottom-color: var(--colar-green-6);
  }

  .wrapper.full .word {
    color: var(--colar-green-6);
  }

  .wrapper.invalid {
    border-bottom-color: var(--colar-red-6);
  }

  .wrapper.invalid .word {
    color: var(--colar-red-6);
  }

  .icon-btn {
    align-self: center;
  }
</style>
