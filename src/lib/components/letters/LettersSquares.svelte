<script>
    import { createEventDispatcher } from "svelte";
    
    import Square from "$lib/components/Square.svelte";

    const dispatch = createEventDispatcher();

    export let letters;
</script>

<div>
    { #each Array(9) as _, i }
        { @const letter = letters[i] }
        <Square
            value={ letter?.value ?? null }
            disabled={ letter?.selected }
            valid={ true }
            --font-size="2.5rem"
            on:click={ e => { if (letter) dispatch('selectsquare', letter); } }
        />
    { /each }
</div>

<style>
    div {
        display: grid;
        grid-template-rows: repeat(3, 5rem);
        grid-template-columns: repeat(3, 5rem);
        gap: 0.5rem;
    }
</style>
