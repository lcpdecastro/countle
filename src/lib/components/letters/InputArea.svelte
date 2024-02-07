<script>
  import { createEventDispatcher } from "svelte";

  import dictionary from '$lib/js/dictionary.js';

  import Backspace from "phosphor-svelte/lib/Backspace";
  import Trash from "phosphor-svelte/lib/Trash";

  const dispatch = createEventDispatcher();

  let { value = [] } = $props();

  let word = $derived(value.map(x => x.value).join(''));
</script>

<div class="wrapper" class:invalid={ word.length > 0 && (word.length < 3 || !dictionary.has(word.toLowerCase())) } class:full={ word.length === 9 && dictionary.has(word.toLowerCase()) }>
  <div class="word">
    { word || '\u00a0' }
  </div>

  <button class="backspace" on:click={ () => dispatch('removeletter') }>
    <Backspace size="1.5rem" color="var(--theme-color)"/>
  </button>
  <button class="delete" on:click={ () => dispatch('clearword') }>
    <Trash size="1.5rem" color="var(--colar-red-6)" />
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

  button {
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    flex-grow: 0;
    justify-self: end;
    align-self: center;
  }
</style>
