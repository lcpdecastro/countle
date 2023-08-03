<script>
    import { createEventDispatcher, onMount } from 'svelte';

    import shuffleList from 'shuffle-list';

    import settings from '$lib/js/settings.js';
    import { flipTransition } from '$lib/js/flipTransition.js';
    import { socketSend, socketListen, socketClose } from '$lib/js/socket.js';
    import { stringifySteps } from '$lib/js/solvers.js';

    import NumbersTarget from '$lib/components/numbers/NumbersTarget.svelte';
    import NumbersSquares from '$lib/components/numbers/NumbersSquares.svelte';
    import NumbersSteps from '$lib/components/numbers/NumbersSteps.svelte';

    import solveWorker from '$lib/js/worker.js?worker';

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
    
    export let solo;
    export let control;
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

    export function getScore () {
        let v = Math.abs(steps.reduce((p, c) => c.r ? c.r.value : p, undefined) - target);
        return Number.isNaN(v) ? null : v;
    }

    // ==========#==========#==========#========== //

    function generateNumber (isLarge = false) {
        let n;

        if (isLarge) {
            n = largeNumbers.pop();
            largeNumbers = largeNumbers;
        } else {
            n = smallNumbers.pop();
            smallNumbers = smallNumbers;
        }

        if (!solo) socketSend('generate-number', n);

        getNumber(n);
    }

    function getNumber (value) {
        numbers = numbers.concat({ value, selected: false, valid: true });
    }

    function generateTarget () {
        let t = Math.floor(Math.random() * 899) + 101;

        if (!solo) socketSend('generate-target', t);

        getTarget(t);
    }

    function getTarget (value) {
        target = value;

        started = true;
        dispatch('starttimer');

        worker.postMessage( { numbers: numbers.map(x => x.value), target });
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

    if (!solo) {
        socketListen('pass-number', x => getNumber(x));
        socketListen('pass-target', x => getTarget(x));
    } else {
        socketClose();
    }

    // ==========#==========#==========#========== //
    
    onMount(() => {
        worker = new solveWorker();
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
        if (k === 'delete' && steps.length > 0) removeStep(steps.length - 1);
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
        { #if !started && control && numbers.length < 6 }
            <span in:flipTransition out:flipTransition>
                <button on:click={ () => generateNumber(false) }>SMALL</button>
                <button on:click={ () => generateNumber(true) } disabled={ !largeNumbers.length }>LARGE</button>
            </span>
        { :else if !started && control && !target }
            <span in:flipTransition out:flipTransition>
                <button on:click={ generateTarget }>GET TARGET</button>
            </span>
        { :else if timerDone }
            <span in:flipTransition out:flipTransition>
                { #if results }
                    <button on:click={ getSampleSolution }>SHOW A SOLUTION</button>
                { /if }
                
                { #if solo }
                    <button on:click={ () => dispatch('soloreset') }>RESET</button>
                { :else }
                    <button on:click={ () => dispatch('showscoreboard') }>SCOREBOARD</button>
                { /if }
            </span>
        { /if }
    </span>
    
    { #if sampleSolution }
        { @const steps = stringifySteps(sampleSolution.steps).replaceAll('-', '\u2212').replaceAll('*', '\u00d7').replaceAll('/', '\u00f7') }

        <p style:margin=0 style:text-align="center" style:display="flex" style:flex-direction="column" style:gap="0.25rem">
            <span><b>{ results.diff ? `${steps} = ${sampleSolution.value}` : steps }</b></span>
            <svelte:element this={ results.diff ? 'span' : null }>({ results.diff } away)</svelte:element>
            <i style:font-size="smaller">({ results.solutions.length } solutions found)</i>
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
        backface-visibility: hidden;
    }

    .buttons button {
        padding: 0.5rem 0.7rem;
        border: 1px solid currentColor;
        border-radius: 0.75rem;
        color: var(--theme-color);
        font-weight: bold;
        transition-property: background, color, filter, opacity;
        transition-duration: 0.15s;
    }
    
    .buttons button:hover, .buttons button:focus {
        background: var(--theme-color);
        color: white;
    }

    .buttons button:focus {
        outline: 1px solid var(--theme-color);
        outline-offset: 0.125rem;
    }

    .buttons button:disabled {
        filter: grayscale(1);
        opacity: 0.5;
        pointer-events: none;
    }
</style>
