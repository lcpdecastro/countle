<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { LucideXCircle } from "lucide-svelte";

    import { halfFlipTransition } from "$lib/js/flipTransition.js";

    import Square from "$lib/components/Square.svelte";
    import NumbersOperations from "$lib/components/numbers/NumbersOperations.svelte";
    import NumbersOperationsPanel from "$lib/components/numbers/NumbersOperationsPanel.svelte";
    
    const dispatch = createEventDispatcher();
    const shortcuts = ['A', 'S', 'D', 'F'];

    export let steps;
    export let target;
    export let alt = true;
    export let solved = false;
    export let timerDone;

    let mounted;

    $: solved = steps.at(-1)?.r?.value === target;

    onMount(() => mounted = true);
</script>

<div class="wrapper">
    <div class="steps">
        { #each steps as step, i }
            { @const a = step.a }
            { @const b = step.b }
            { @const r = step.r }

            <div class="step" in:halfFlipTransition out:halfFlipTransition>
                <Square
                    value={ a?.value || null }
                    valid={ a?.valid }
                    --font-size={ '1.5rem' }
                    on:click={ () => { if (a?.value) dispatch('deselectsquare', a); } } />

                <span>
                    <NumbersOperations
                        bind:value={ steps[i].o }
                        operands={ [a?.value, b?.value] }
                        { alt }
                        on:selectoperation
                        on:removeoperation={ () => dispatch('removeoperation', i) } />
                </span>

                <Square
                    value={ b?.value || null }
                    valid={ b?.valid }
                    --font-size={ '1.5rem' }
                    on:click={ () => { if (b?.value) dispatch('deselectsquare', b); } } />

                <span>&equals;</span>

                <Square
                    value={ r?.value ?? null }
                    disabled={ r?.selected }
                    valid={ r?.valid }
                    shortcut={ shortcuts?.[i] }
                    --theme-color={ r?.value === target ? 'var(--green)' : null }
                    --font-size={ '1.5rem' }
                    on:click={ () => { if (i < 4 && r?.value) dispatch('selectsquare', r); } }
                />

                <button class="remove" on:click={ () => dispatch('removestep', i) }>
                    <LucideXCircle strokeWidth=1 absoluteStrokeWidth={ true } color="var(--red)" size="1.5rem" />
                </button>
            </div>
        { /each }
    </div>

    { #if mounted && !alt }
        <NumbersOperationsPanel
            disabled={ solved || timerDone || steps.length === 0 || steps?.[4]?.r || (steps.at(-1)?.o && !steps.at(-1).r) }
            operands={ Object.values(steps.at(-1) ?? { '_': false }).every(x => x) ? [steps.at(-1)?.r?.value, null] : [steps.at(-1)?.a?.value, steps.at(-1)?.b?.value] }
            on:selectoperation
        />
    { /if }
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
    }

    .steps {
        display: grid;
        grid-template-rows: repeat(5, 3rem);
        grid-template-columns: 100%;
        gap: 0.5rem;
    }

    .step {
        display: grid;
        grid-template-columns: repeat(5, 3rem) 1.5rem;
        grid-template-rows: 3rem;
        gap: 0.5rem;
        align-items: center;
        justify-items: center;
        align-self: center;
        color: var(--theme-color);
        font-weight: bold;
        font-size: 2rem;
    }

    .step > span {
        width: 100%;
        height: 100%;
        border: 1px solid currentColor;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        align-items: center;
        justify-items: center;
        border-radius: 30%;
        color: var(--theme-color);
        font-size: 1.5rem;
        overflow: hidden;
    }

    .step > span:focus-within {
        outline: 1px solid var(--theme-color);
        outline-offset: 0.125rem;
    }

    .remove {
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: grid;
        align-items: center;
        justify-items: center;
        border-radius: 100%;
    }
    
    .remove:focus {
        outline: 1px solid var(--red);
        outline-offset: 0.1rem;    
    }
</style>
