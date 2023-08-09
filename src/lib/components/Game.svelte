<script>
    import { setContext } from 'svelte';
    import seed from 'seed-random';
    import dayjs from 'dayjs';

    import Timer from '$lib/components/Timer.svelte';
    import Settings from '$lib/components/Settings.svelte';

    import { logDaily } from '$lib/js/daily.js';

    import { page } from '$app/stores';

    // ==========#==========#==========#========== //
    
    export let game;

    // ==========#==========#==========#========== //

    let timerComponent;
    let timerDone;

    let gameComponent;

    let daily = $page.url.pathname.includes('daily');
    setContext('daily', $page.url.pathname.includes('daily'));

    $: {
        void $page;
        if (daily) seed(dayjs().format('YYYYMMDD'), { global: true });
        else seed.resetGlobal();
    }

    // ==========#==========#==========#========== //

    function reset () {
        timerComponent.reset();
        gameComponent.reset();
    }
</script>

<div class="upper">
    <Settings />
    
    <Timer bind:this={ timerComponent } bind:done={ timerDone } on:timerdone={ () => daily && logDaily(gameComponent.getDailyTrial()) } />
</div>

<svelte:component this={ game } bind:this={ gameComponent } { timerDone }
    on:starttimer={ timerComponent.start }
    on:draintimer={ timerComponent.drain }
    on:gamereset={ reset }
/>

<style>
    :root {
        --theme-color: var(--blue);
    }

    .upper {
        width: 100%;
        height: max-content;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
</style>
