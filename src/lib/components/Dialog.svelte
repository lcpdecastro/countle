<script>
  import { page } from '$app/stores';
  import X from 'lucide-svelte/icons/x';

  let dialog = $state();

  export function open () {
    dialog.showModal();
  }

  export function close () {
    dialog.close();
  }
  
  let dialogBody = $state();

  $effect(() => {
    void $page.url.pathname;
    dialogBody.scrollTop = 0;
  });
</script>

<dialog bind:this={ dialog }>
  <div class="back" onclick={ close } />

  <div class="main">
    <div class="top">
      <h1>
        <slot name="title" />
      </h1>

      <button class="icon-btn close" onclick={ close }>
        <X size="100%" strokeWidth="var(--border-width)" color="currentColor" />
      </button>
    </div>

    <div class="body" bind:this={ dialogBody }>
      <slot name="body" />
    </div>

    <div class="bottom">
      <button class="text-btn" onclick={ close }>OK</button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    --transition-duration: 0.15s;
    
    width: 100%;
    height: 100%;
    max-width: unset;
    max-height: unset;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    display: grid;
    background: none;
    border: none;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    color: var(--colar-gray-11);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition-duration), visibility var(--transition-duration) var(--transition-duration);
  }

  dialog::backdrop {
    display: none;
  }

  dialog[open] {
    opacity: 1;
    visibility: visible;
    transition: opacity var(--transition-duration);
  }

  .back, .main {
    grid-area: 1 / 1 / 2 / 2;
  }

  .back {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .main {
    width: 80vw;
    max-width: 40rem;
    height: min-content;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.1);
    background: white;
    border-radius: 1.5rem;
  }

  .top {
    padding: 1.5rem;
    display: flex;
  }

  .top h1 {
    margin: 0;
    flex-grow: 1;
  }

  .close {
    width: 2rem;
    height: 2rem;
    align-self: center;
    justify-self: end;
    color: var(--colar-gray-6);
  }

  .close:hover, .close:focus {
    color: var(--colar-red-6);
  }

  .close:focus {
    outline: currentColor solid var(--border-width);
  }

  .body, .bottom {
    padding: 1rem 1.5rem;
  }

  .body {
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-top: var(--border-width) solid var(--colar-gray-3);
    border-bottom: var(--border-width) solid var(--colar-gray-3);
    line-height: 1.5;
    overflow: auto;
  }

  .bottom {
    display: flex;
    gap: 1rem;
  }

  .bottom .text-btn {
    margin-left: auto;
  }

  @media (prefers-color-scheme: dark) {
    .main {
      background: var(--colar-gray-11);
      color: var(--colar-gray-2);
    }

    .body {
      border-top: var(--border-width) solid var(--colar-gray-9);
      border-bottom: var(--border-width) solid var(--colar-gray-9);
    }
  }
</style>
