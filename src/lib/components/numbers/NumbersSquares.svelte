<script>
    import { createEventDispatcher } from "svelte";
    
    import Square from "$lib/components/Square.svelte";

    const dispatch = createEventDispatcher();
    const shortcuts = ['Q', 'W', 'E', 'R', 'T', 'Y'];

    export let numbers;
</script>

<div>
    { #each Array(6) as _, i }
        { @const number = numbers[i] }
        <Square
            value={ number?.value ?? null }
            disabled={ number?.selected }
            valid={ number?.valid }
            shortcut={ shortcuts[i] }
            on:click={ e => { if (number) dispatch('selectsquare', number); } }
        />
    { /each }
</div>

<style>
    div {
        display: grid;
        grid-template-rows: repeat(6, 3rem);
        grid-template-columns: 3rem;
        gap: 0.5rem;
    }
</style>
