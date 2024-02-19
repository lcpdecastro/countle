<script>
  import { getContext } from "svelte";

  import dictionary from '$lib/js/dictionary.js';

  import Backspace from "lucide-svelte/icons/delete";
  import Trash from "lucide-svelte/icons/trash-2";

  const running = getContext('running');

  let { value = [], onRemoveLetter, onClearWord } = $props();

  let word = $derived(value.map(x => x.value).join(''));
</script>

<div class="wrapper" class:invalid={ word.length > 0 && (word.length < 3 || !dictionary.has(word.toLowerCase())) } class:full={ word.length === 9 && dictionary.has(word.toLowerCase()) }>
  <div class="word">
    { word || '\u00a0' }
  </div>

  <button class="icon-btn backspace" disabled={ !$running }
    onclick={ onRemoveLetter }
  >
    <Backspace strokeWidth="0.075rem" size="100%" />
  </button>
  <button class="icon-btn delete" disabled={ !$running }
    onclick={ onClearWord }
  >
    <Trash strokeWidth="0.075rem" size="100%" />
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

  .backspace {
    color: var(--theme-color);
  }

  .delete {
    color: var(--colar-red-6);
  }
</style>
