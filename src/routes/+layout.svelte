<script>
  import dayjs from 'dayjs';

  import { page } from '$app/stores';

  import About from '$lib/components/About.svelte';
  import Menu from '$lib/components/Menu.svelte';
  import Instructions from '$lib/components/Instructions.svelte';

  import '$lib/css/style.css';
</script>

<svelte:head>
  <title>COUNTLE</title>
  <link rel="icon" href={ `/icon${$page.url.pathname.replaceAll('/', '-')}.png` } />
  <meta name="theme-color" content={ $page.url.pathname.includes('daily') ? '#fab005' : '#4c6ef5' }>
</svelte:head>

<div class="wrapper" style:display="contents"
  class:daily={ $page.url.pathname.includes('daily') }
  class:arcade={ $page.url.pathname.includes('arcade') }
>
  <header>
    <div>
      <About />
      <span class="page-name">
        <span class="a">{ $page.url.pathname.split?.('/').at(-1).toUpperCase() }</span>
        <span class="b">{ $page.url.pathname.includes('daily') ? dayjs().format('YYYY.MM.DD') : $page.url.pathname.includes('arcade') ? 'ARCADE' : 'INFINITE' }</span>
      </span>
      <Instructions />
      <Menu />
    </div>
  </header>

  <main>
    <slot />
  </main>
</div>

<style>
  .wrapper {
    --theme-color: var(--colar-indigo-6);
    --theme-color-light: var(--colar-indigo-0);
  }
  
  .wrapper.daily {
    --theme-color: var(--colar-yellow-6);
    --theme-color-light: var(--colar-yellow-0);
  }
  
  .wrapper.arcade {
    --theme-color: var(--colar-purple-6);
    --theme-color-light: var(--colar-purple-0);
  }

  header {
    width: 100%;
    height: max-content;
    padding: 1rem;
    position: sticky;
    top: 0;
    display: grid;
    align-items: center;
    justify-items: center;
    background: var(--theme-color);
    color: white;
    z-index: 1;
    transition: background 0.15s;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  header div {
    width: 23rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .page-name {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    line-height: 1;
  }

  .page-name .b {
    font-size: 75%;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  main {
    width: 23rem;
    height: min-content;
    padding: 1rem 0;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
</style>
