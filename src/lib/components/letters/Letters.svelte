<script>
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import shuffleList from 'shuffle-list';

    import LettersSquares from '$lib/components/letters/LettersSquares.svelte';
    import LettersInput from '$lib/components/letters/LettersInput.svelte';

    import flipTransition from '$lib/js/flipTransition.js';
    import { getDaily } from '$lib/js/daily.js';

    const dispatch = createEventDispatcher();

    // ==========#==========#==========#========== //

    let vowels = shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split(''));
    let consonants = shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split(''));
    
    let letters = [];
    let word = [];
    let started = false;
    
    let vowelSel = 0;
    let consonantSel = 0;
    
    // ==========#==========#==========#========== //

    const daily = getContext('daily');
    
    // ==========#==========#==========#========== //

    export let timerDone;
    
    export function reset () {
        vowels = shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split(''));
        consonants = shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split(''));

        letters = [];
        word = [];
        started = false;

        vowelSel = 0;
        consonantSel = 0;
        
        results = null;
        showLongest = false;
        
        dispatch('resettimer');
    }

    export function getDailyTrial () {
        return {
            letters: {
                input: word.map(x => letters.indexOf(x)),
                results
            }
        };
    }

    // ==========#==========#==========#========== //

    function generateLetter (isVowel = false) {
        let value;

        if (isVowel) {
            value = vowels.pop();
            vowels = vowels;
            vowelSel++;
        } else {
            value = consonants.pop();
            consonants = consonants;
            consonantSel++;
        }

        letters = letters.concat({ value, selected: false });
        
        if (letters.length < 9) return;

        started = true;
        dispatch('starttimer');

        worker?.postMessage({ letters: letters.map(x => x.value) });
    }

    function generateDaily () {
        const c = Math.floor(Math.random() * 2) + 4;
        shuffleList(Array(9).fill(false, 0, c).fill(true, c)).forEach(x => generateLetter(x));
    }

    function selectSquare (n) {
        if (n.selected) return;

        n.selected = true;
        letters = letters;
        word = word.concat(n);
    }

    function backspace () {
        if (!word.length) return;

        word.at(-1).selected = false;
        letters = letters;
        word = word.slice(0, -1);
    }

    function clear () {
        if (!word.length) return;

        word.forEach(x => x.selected = false);
        letters = letters;
        word = [];
    }

    // ==========#==========#==========#========== //

    let worker;
    let results = null;
    let showLongest = false;

    // ==========#==========#==========#========== //
    
    onMount(() => {
        const d = getDaily('letters');

        if (daily && d) {
            generateDaily();

            word = d.input.map(x => letters[x]);
            d.input.forEach(x => letters[x].selected = true);

            results = d.results;
            dispatch('draintimer');

            return;
        }

        worker = new Worker(new URL('$lib/js/worker.js', import.meta.url), { type: 'module' });
        worker.addEventListener('message', e => results = e.data);
    });
</script>

<svelte:window
    on:keydown={ e => {
        if (!started || timerDone) return;

        const k = e.key;

        if (k.toUpperCase().match(/^[A-Z]{1}$/g)) {
            let l = letters.find(x => x.value === k.toUpperCase() && !x.selected);
            if (l) selectSquare(l);
        }
        if (k === 'Backspace') backspace();
        if (k === 'Delete') clear();
    } }
/>

<div class="wrapper">
    <div class="input-wrapper" inert={ !started || timerDone }>
        <LettersSquares { letters }
            on:selectsquare={ e => selectSquare(e.detail) }
        />

        <LettersInput { word }
            on:backspace={ backspace }
            on:clear={ clear }
        />
    </div>

    <span class="buttons">
        { #if !started && !daily && letters.length < 9 }
            <span in:flipTransition out:flipTransition>
                <button on:click={ () => generateLetter(false) } disabled={ consonantSel === 6 }>CONSONANT</button>
                <button on:click={ () => generateLetter(true) } disabled={ vowelSel === 5 }>VOWEL</button>
            </span>
        { :else if !started && daily }
            <span in:flipTransition out:flipTransition>
                <button on:click={ generateDaily }>SHOW TODAY&CloseCurlyQuote;S LETTERS</button>
            </span>
        { :else if timerDone }
            <span in:flipTransition out:flipTransition>
                <button on:click={ () => showLongest = true } disabled={ !results }>{ results ? 'SHOW LONGEST WORDS' : 'SOLVING\u2026' }</button>
                
                { #if !daily }
                    <button on:click={ () => dispatch('gamereset') }>RESET</button>
                { /if }
            </span>
        { /if }
    </span>

    { #if showLongest && results }
        <p style:margin=0 style:text-align="center" style:display="flex" style:flex-direction="column" style:gap="0.25rem">
            <span class="words">
                { #each results.words as word }
                    <span><b>{ word }</b></span>
                { /each }
            </span>
            <i style:font-size="smaller">({ results.words.length } { results.longest }-letter word{ results.words.length === 1 ? '' : 's' } found)</i>
        </p>
    { /if }
</div>

<style>
    .wrapper {
        width: 100%;
        height: min-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .input-wrapper {
        display: contents;
    }

    .buttons {
        width: 100%;
        height: max-content;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        justify-items: center;
    }

    .buttons > span {
        grid-area: 1 / 1 / 2 / 2;
        display: flex;
        gap: 0.5rem;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    .buttons button {
        padding: 0.5rem 0.7rem;
        border: 1px solid currentColor;
        border-radius: 0.75rem;
        color: var(--theme-color);
        font-weight: bold;
        transition-property: background, color, filter, opacity, border;
        transition-duration: 0.15s;
    }

    @media (hover: hover) {
        .buttons button:hover {
            border: 1px solid var(--theme-color);
            background: var(--theme-color);
            color: white;
        }
    }
    
    .buttons button:focus {
        border: 1px solid var(--theme-color);
        background: var(--theme-color);
        color: white;
        outline: 1px solid var(--theme-color);
        outline-offset: 0.125rem;
    }

    .buttons button:disabled {
        filter: grayscale(1);
        opacity: 0.5;
        pointer-events: none;
    }

    .words {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem 1rem;
    }
</style>
