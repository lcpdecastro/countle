<script>
    import { createEventDispatcher, getContext, onMount } from 'svelte';

    import shuffleList from 'shuffle-list';

    import settings from '$lib/js/settings.js';
    import flipTransition from '$lib/js/flipTransition.js';
    import { getDaily } from '$lib/js/daily.js';

    import NumbersTarget from '$lib/components/numbers/NumbersTarget.svelte';
    import NumbersSquares from '$lib/components/numbers/NumbersSquares.svelte';
    import NumbersSteps from '$lib/components/numbers/NumbersSteps.svelte';

    const dispatch = createEventDispatcher();

    // ==========#==========#==========#========== //

    let smallNumbers = shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
    let largeNumbers = shuffleList([25, 50, 75, 100]);
    
    let numbers = [];
    let target = null;
    let steps = [];
    let started = false;

    let solved;

    // ==========#==========#==========#========== //

    const daily = getContext('daily');

    // ==========#==========#==========#========== //
    
    export let timerDone;

    export function reset () {
        smallNumbers = shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
        largeNumbers = shuffleList([25, 50, 75, 100]);

        numbers = [];
        target = null;
        steps = [];
        started = false;

        results = null;
        sampleSolution = null;

        dispatch('resettimer');
    }

    export function getDailyTrial () {
        let cc = numbers.concat(steps.map(s => s.r)).filter(x => x);

        return {
            numbers: {
                input: steps.map(s => [cc.indexOf(s.a), s.o, cc.indexOf(s.b)]),
                results
            }
        };
    }

    // ==========#==========#==========#========== //

    function generateNumber (isLarge = false) {
        let value;

        if (isLarge) {
            value = largeNumbers.pop();
            largeNumbers = largeNumbers;
        } else {
            value = smallNumbers.pop();
            smallNumbers = smallNumbers;
        }

        numbers = numbers.concat({ value, selected: false, valid: true });
    }

    function generateTarget () {
        target = Math.floor(Math.random() * 899) + 101;

        started = true;
        dispatch('starttimer');

        worker?.postMessage({ numbers: numbers.map(x => x.value), target });
    }

    function generateDaily () {
        const c = Math.floor(Math.random() * 5);
        shuffleList(Array(6).fill(true, 0, c).fill(false, c)).forEach(x => generateNumber(x));
        generateTarget();
    }

    function selectSquare (n) {
        if (solved) return;
        if (n.selected || !n.valid) return;
        
        if (steps.length === 0 || steps.at(-1).r) steps = steps.concat({ a: null, b: null, o: null, r: null });

        if (!steps.at(-1).a) steps.at(-1).a = n;
        else if (!steps.at(-1).b) steps.at(-1).b = n;
        else return;
        
        n.selected = true;
        numbers = numbers;
        steps = steps;
    }

    function deselectSquare (n) {
        if (solved) return;

        n.selected = false;
        
        const i = steps.findIndex(x => x.a === n || x.b === n);

        if (steps[i].a === n) steps[i].a = null;
        if (steps[i].b === n) steps[i].b = null;
        if (!steps[i].a && !steps[i].b) steps[i].o = null;
        
        for (let j = steps.length - 1; j > i; j--) {
            const step = steps[j];
            if (step.a?.selected) step.a.selected = false;
            if (step.b?.selected) step.b.selected = false;
        }

        numbers = numbers;
        steps = steps.slice(0, i + +Object.values(steps[i]).some(x => x));
    }

    function selectOperation (op) {
        if (solved) return;
        if (steps.length === 5) return;

        let lastStep = steps.at(-1);
        if (!lastStep) return;

        if (Object.values(lastStep).every(x => x)) {
            selectSquare(lastStep.r);
            lastStep = steps.at(-1);
        } else if (lastStep.o) return;

        const [a, b] = [lastStep.a?.value, lastStep.b?.value];

        switch (op) {
            case '\u2212':
                if (a === 1 || a <= b || a === b * 2) return;
                break;
            case '\u00d7':
                if (a === 1 || b === 1) return;
                break;
            case '\u00f7':
                if (a === 1 || b === 1 || a % b || a === b ** 2 ) return;
                break;
        }

        lastStep.o = op;
        steps = steps;
    }

    function removeOperation (i) {
        if (solved) return;

        steps[i].o = null;

        for (let j = steps.length - 1; j > i; j--) {
            const step = steps[j];
            if (step.a?.selected) step.a.selected = false;
            if (step.b?.selected) step.b.selected = false;
        }

        numbers = numbers;
        steps = steps.slice(0, i + +Object.values(steps[i]).some(x => x));
    }

    function removeStep (i) {
        if (solved) return;

        for (let j = steps.length - 1; j >= i; j--) {
            const step = steps[j];
            if (step.a?.selected) step.a.selected = false;
            if (step.b?.selected) step.b.selected = false;
        }

        numbers = numbers;
        steps = steps.slice(0, i);
    }

    function checkValid (num, op, { a = null, b = null }) {
        if (a) {
            switch (op) {
                case '\u2212': return a > num && a !== 2 * num;
                case '\u00d7': return num !== 1;
                case '\u00f7': return num !== 1 && !(a % num) && a !== num * num;
            }
        }
            
        switch (op) {
            case '\u2212': return num > b && num !== 2 * b;
            case '\u00d7': return num !== 1;
            case '\u00f7': return b !== 1 && !(num % b) && num !== b * b;
        }

        return true;
    }

    $: {
        for (const step of steps) {
            if (step.a && step.o && step.b && !step.r) {
                const [a, o, b] = [step.a.value, step.o, step.b.value];
                const value = o === '\u002b' ? a + b : o === '\u2212' ? a - b : o === '\u00d7' ? a * b : o === '\u00f7' ? a / b : null;
                if (value) step.r = { value, selected: false, valid: true };
            } else if ((!step.a || !step.o || !step.b) && step.r) step.r = null;
        }
    }

    $: {
        let lastStep = steps.at(-1);

        if (lastStep?.o && (!lastStep.a !== !lastStep.b)) {
            for (let n of numbers) {
                if (!n.selected) n.valid = checkValid(n.value, lastStep.o, { a: lastStep.a?.value, b: lastStep.b?.value });
            }
            for (let s of steps) {
                if (s.r?.selected === false) s.r.valid = checkValid(s.r.value, lastStep.o, { a: lastStep.a?.value, b: lastStep.b?.value });
            }
        } else {
            for (let n of numbers) {
                if (!n.selected) n.valid = true;
            }
            for (let s of steps) {
                if (s.r?.selected === false) s.r.valid = true;
            }
        }

        numbers = numbers;
        steps = steps;
    }

    // ==========#==========#==========#========== //

    let worker;
    let results = null;
    let sampleSolution = null;

    function getSampleSolution () {
        sampleSolution = results.solutions[Math.floor(Math.random() * results.solutions.length)];
    }

    // ==========#==========#==========#========== //

    onMount(() => {
        const d = getDaily('numbers');

        if (daily && d) {
            generateDaily();

            for (let x of d.input) {
                steps = steps.concat({
                    a: numbers[x[0]] ?? steps[x[0] - 6]?.r ?? null,
                    o: x[1],
                    b: numbers[x[2]] ?? steps[x[2] - 6]?.r ?? null
                });

                const a = steps.at(-1).a?.value;
                const o = steps.at(-1).o;
                const b = steps.at(-1).b?.value;

                if (a && b) steps.at(-1).r = {
                    value: o === '\u002b' ? a + b : o === '\u2212' ? a - b : o === '\u00d7' ? a * b : o === '\u00f7' ? a / b : null,
                    selected: false
                };

                if (a) steps.at(-1).a.selected = true;
                if (b) steps.at(-1).b.selected = true;
            }

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
        if (!$settings['numbersShortcuts']) return;

        const k = e.key.toLowerCase();

        const squares = ['q', 'w', 'e', 'r', 't', 'y'];
        const intermediates = ['a', 's', 'd', 'f'];
        const operations = { '+': '\u002b', '-': '\u2212', '*': '\u00d7', 'x': '\u00d7', '/': '\u00f7' };

        if (squares.includes(k)) selectSquare(numbers[squares.indexOf(k)]);
        if (intermediates.includes(k)) {
            const n = steps[intermediates.indexOf(k)];
            if (n?.r) selectSquare(n.r);
        }
        if (k in operations) selectOperation(operations[k]);
        if (k === 'backspace') {
            const lastStep = steps.at(-1);
            if (!lastStep) return;

            if (lastStep.b) deselectSquare(lastStep.b);
            else if (lastStep.o) removeOperation(steps.length - 1);
            else if (lastStep.a) deselectSquare(lastStep.a);
        }
        if (k === 'delete' && steps.length > 0) {
            if (e.shiftKey) removeStep(0);
            else removeStep(steps.length - 1);
        }
    } }
/>

<div class="wrapper">
    <NumbersTarget value={ target } />

    <div class="input-wrapper" inert={ !started || solved || timerDone }>
        <NumbersSquares { numbers }
            on:selectsquare={ e => selectSquare(e.detail) }
        />
        
        <NumbersSteps { steps } { target } alt={ $settings['alternateOperations'] } bind:solved { timerDone }
            on:selectsquare={ e => selectSquare(e.detail) }
            on:deselectsquare={ e => deselectSquare(e.detail) }
            on:selectoperation={ e => selectOperation(e.detail) }
            on:removeoperation={ e => removeOperation(e.detail) }
            on:removestep={ e => removeStep(e.detail) }
        />
    </div>

    <span class="buttons">
        { #if !started && !daily && numbers.length < 6 }
            <span in:flipTransition out:flipTransition>
                <button on:click={ () => generateNumber(false) }>SMALL</button>
                <button on:click={ () => generateNumber(true) } disabled={ !largeNumbers.length }>LARGE</button>
            </span>
        { :else if !started && !daily && !target }
            <span in:flipTransition out:flipTransition>
                <button on:click={ generateTarget }>GET TARGET</button>
            </span>
        { :else if !started && daily }
            <span in:flipTransition out:flipTransition>
                <button on:click={ generateDaily }>SHOW TODAY&CloseCurlyQuote;S NUMBERS</button>
            </span>
        { :else if timerDone }
            <span in:flipTransition out:flipTransition>
                <button on:click={ getSampleSolution } disabled={ !results }>{ results ? 'SHOW A SOLUTION' : 'SOLVING\u2026' }</button>
                
                { #if !daily }
                    <button on:click={ () => dispatch('gamereset') }>RESET</button>
                { /if }
            </span>
        { /if }
    </span>
    
    { #if sampleSolution }
        { @const steps = sampleSolution.steps.replaceAll('-', '\u2212').replaceAll('*', '\u00d7').replaceAll('/', '\u00f7') }

        <p style:margin=0 style:text-align="center" style:display="flex" style:flex-direction="column" style:gap="0.25rem">
            <span><b>{ results.diff ? `${steps} = ${sampleSolution.value}` : steps }</b></span>
            <svelte:element this={ results.diff ? 'span' : null }>({ results.diff } away)</svelte:element>
            <i style:font-size="smaller">({ results.solutions.length } solution{ results.solutions.length === 1 ? '' : 's' } found)</i>
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
        display: grid;
        grid-template-columns: 3rem 19rem;
        grid-template-rows: auto;
        gap: 1rem;
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
</style>
