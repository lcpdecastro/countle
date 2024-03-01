<script>
  import { page, navigating } from '$app/stores';

  import Menu from 'lucide-svelte/icons/menu';

  let menu = $state();
  let waiting = $state(false);

  $effect(() => {
    if ($navigating) waiting = true;
    if (waiting && !$navigating) {
      waiting = false;
      menu.close();
    }
  });
</script>

<dialog bind:this={ menu }>
  <div class="back" onclick={ () => menu.close() } />

  <nav>
    <h2>CLASSIC</h2>
    <a class:current={ $page.url.pathname === '/classic/letters' } href="/classic/letters">LETTERS</a>
    <a class:current={ $page.url.pathname === '/classic/numbers' } href="/classic/numbers">NUMBERS</a>
    <hr />
    <h2>DAILY</h2>
    <a class:current={ $page.url.pathname === '/daily/letters' } href="/daily/letters">LETTERS</a>
    <a class:current={ $page.url.pathname === '/daily/numbers' } href="/daily/numbers">NUMBERS</a>
    <hr />
    <h2>ARCADE</h2>
    <a class:current={ $page.url.pathname === '/arcade/letters' } href="/arcade/letters">LETTERS</a>
    <a class:current={ $page.url.pathname === '/arcade/numbers' } href="/arcade/numbers">NUMBERS</a>
  </nav>
</dialog>

<button class="icon-btn" onclick={ () => menu.showModal() }>
  <Menu strokeWidth="0.1rem" size="100%" />
</button>

<style>
  dialog {
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
    overflow: hidden;
    visibility: hidden;
    transition: visibility 0.15s 0.15s;
  }

  dialog[open] {
    visibility: visible;
    transition: none;
  }

  dialog::backdrop {
    display: none;
  }

  .back, nav {
    grid-area: 1 / 1 / 2 / 2;
  }

  .back {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.15s;
  }

  dialog[open] .back {
    opacity: 1;
  }
  
  nav {
    min-width: max-content;
    width: 50vw;
    max-width: 20rem;
    height: 100%;
    padding: 1rem;
    position: fixed;
    right: 0;
    background: var(--theme-color);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: white;
    transform: translateX(100%);
    transition: transform 0.15s;
  }

  dialog[open] nav {
    transform: none;
  }

  nav h2 {
    margin: 0;
  }

  nav a {
    padding: 0.3rem 0.5rem;
    border-radius: 0.5rem;
    color: white;
    text-decoration: none;
    transition-property: background, color;
    transition-duration: 0.15s;
  }

  nav a:hover, nav a.current {
    color: var(--theme-color);
    background: white;
  }

  nav a:focus {
    outline: white solid var(--border-width);
    outline-offset: 0.15rem;
  }

  nav a.current {
    font-weight: bold;
  }

  hr {
    width: 100%;
    height: 0;
    border: none;
    border-top: var(--border-width) solid white;
  }

  .icon-btn {
    align-self: center;
  }

  @media (prefers-color-scheme: dark) {
    .main {
      color: var(--colar-gray-2);
    }

    nav {
      background: var(--colar-gray-11);
      color: var(--colar-gray-2);
    }

    nav a:hover, nav a.current {
      color: var(--colar-gray-11);
    }

    nav a.current {
      background: var(--theme-color);
    }
  }
</style>
