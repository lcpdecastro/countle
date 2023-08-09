<script>
    import IconSettings from 'phosphor-svelte/lib/Gear';
    
    import settings from '$lib/js/settings.js';

    import Modal from '$lib/components/Modal.svelte';

    let open = false;
</script>

<button on:click={ () => open = true }>
    <IconSettings size="100%" />
</button>

<Modal bind:open>
    <svelte:fragment slot="title">Settings</svelte:fragment>

    <div class="modal-body" slot="body">
        <div class="inputs">
            <input type="checkbox" id="reducedMotion" bind:checked={ $settings['reducedMotion'] }>
            <label for="reducedMotion">
                <span>Reduce motion</span>
                <span>Replaces movement-heavy animations with simple fades.</span>
            </label>

            <input type="checkbox" id="alternateOperations" bind:checked={ $settings['alternateOperations'] }>
            <label for="alternateOperations">
                <span>Enable alternate operation selection</span>
                <span>Moves operation selection to each step instead of on a separate row.</span>
                <span>Enabling this may make input difficult due to smaller buttons.</span>
                <span>Chaining steps would also be impossible without a keyboard.</span>
            </label>

            <input type="checkbox" id="numbersShortcuts" bind:checked={ $settings['numbersShortcuts'] }>
            <label for="numbersShortcuts">
                <span>Enable keyboard shortcuts for Numbers games</span>
                <span>Allows input to Numbers games using the keyboard.</span>
                <span>The <b>Q W E R T Y</b> keys select one of the six chosen numbers.</span>
                <span>The <b>A S D F</b> keys select one of the first four intermediate results.</span>
                <span>The <b>+ - * /</b> keys select the corresponding operations.</span>
                <span>The <b>X</b> key also selects multiplication.</span>
                <span>The <b>Backspace</b> key removes the latest number / operation.</span>
                <span>The <b>Delete</b> key removes entire steps.</span>
            </label>
        </div>
    </div>
</Modal>

<style>
    button {
        width: 1.5rem;
        height: 1.5rem;
        padding: initial;
        flex-shrink: 0;
        display: flex;
        border-radius: 0.5rem;
        color: var(--theme-color);
        outline-offset: 0.25rem;
        transition-property: filter, opacity;
        transition-duration: 0.15s;
    }

    button:focus {
        outline: 1px solid var(--theme-color);
    }

    button:disabled {
        filter: grayscale(1);
        opacity: 0.5;
        pointer-events: none;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        line-height: 1.25;
    }

    .inputs {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 1rem;
    }

    .inputs input {
        align-self: first baseline;
        accent-color: var(--theme-color);
    }

    .inputs label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .inputs label span:first-child {
        font-weight: bold;
    }

    .inputs label span:not(:first-child) {
        font-size: smaller;
    }
</style>
