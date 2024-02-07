<script>
  import dayjs from 'dayjs';

  import { page } from '$app/stores';

  import Menu from '$lib/components/Menu.svelte';
  import About from '$lib/components/About.svelte';
  import Instructions from '$lib/components/Instructions.svelte';

  import '$lib/css/style.css';
</script>

<svelte:head>
  <title>COUNTLE</title>
  <link rel="icon" href={ `/icon-192.png` } />
  <meta name="theme-color" content={ $page.url.pathname.includes('daily') ? '#eba70c' : '#3167fa' }>
</svelte:head>

<header>
  <div>
    <About />
    <span>
      <span>{ $page.route.id.split?.('/').at(-1).toUpperCase() }</span>
      <span class="sub">{ $page.route.id.includes('daily') ? dayjs().format('YYYY.MM.DD') : 'INFINITE' }</span>
    </span>
    <span>
      <Instructions />
    </span>
    
    <Menu />
  </div>
</header>

<main>
  <slot />
</main>

<style>
  :root {
    --theme-color: var(--colar-indigo-6);
    --theme-color-light: var(--colar-indigo-0);
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
  }

  header > div {
    width: 23rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  header > div > span {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  header > div > span > .sub {
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
