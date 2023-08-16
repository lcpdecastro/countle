<div class="wrapper">
    <div class="c">C</div>OUNTLE
</div>

<style>
    .wrapper {
        --font-size: calc(3.5 * min(4vw, 1rem) - 0.25rem);

        width: 100%;
        height: calc(var(--font-size) + 2rem);
        padding: 0.5rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: calc(0.0625 * var(--font-size));
        font-weight: 900;
        font-size: var(--font-size);
        color: var(--theme-color);
    }

    .c {
        width: calc(var(--font-size) + 1rem);
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
        border-radius: calc(100% / 3);
        background: var(--theme-color);
        color: white;
    }
</style>
