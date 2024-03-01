<script>
  import Backspace from 'lucide-svelte/icons/delete';
  import Trash from 'lucide-svelte/icons/trash-2';

  let { input = [], active, invalid = false, onRemoveLetter, onClearWord } = $props();

  let word = $derived(input.map(x => x.value).join(''));
</script>

<div class="wrapper" class:invalid>
  <div class="word">
    { word || '\u00a0' }
  </div>

  <button class="icon-btn backspace" disabled={ !active } onclick={ onRemoveLetter }>
    <Backspace strokeWidth="var(--border-width)" size="100%" />
  </button>
  <button class="icon-btn delete" disabled={ !active } onclick={ onClearWord }>
    <Trash strokeWidth="var(--border-width)" size="100%" />
  </button>
</div>

<style>
  .wrapper {
    width: 100%;
    padding: 0.5rem;
    display: flex;
    gap: 1rem;
    border-bottom: var(--border-width) solid var(--theme-color);
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

  .wrapper.invalid {
    border-bottom-color: var(--colar-red-6);
  }

  .wrapper.invalid .word {
    color: var(--colar-red-6);
  }

  .icon-btn {
    align-self: center;
  }

  .backspace, .enter {
    color: var(--theme-color);
  }

  .delete {
    color: var(--colar-red-6);
  }

  @media (prefers-color-scheme: dark) {
    .wrapper.invalid {
      border-bottom-color: var(--colar-red-5);
    }

    .wrapper.invalid .word {
      color: var(--colar-red-5);
    }

    .delete {
      color: var(--colar-red-5);
    }
  }
</style>
