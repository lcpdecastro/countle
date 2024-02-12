<script>
  import shuffleList from 'shuffle-list';
  import seed from 'seed-random';
  import dayjs from 'dayjs';

  import { createEventDispatcher, getContext, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  import Target from './Target.svelte';
  import NumberSelection from './NumberSelection.svelte';
  import Steps from './Steps.svelte';
  import OperationPanel from './OperationPanel.svelte';

  const dispatch = createEventDispatcher();

  const running = getContext('running');
  const done = getContext('done');

  let daily = $page.url.pathname.includes('daily');
  if (daily) seed(dayjs().format('YYYY-MM-DD'), { global: true });

  class N {
    used = $state(false);
    valid = $state(true);

    constructor (value) {
      this.value = value;
    }
  }

  let smallBin = $state(shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]));
  let largeBin = $state(shuffleList([25, 50, 75, 100]));

  let numbers = $state([]);
  let target = $state();
  let steps = $state([]);

  let solutions = $state();
  let sampleSolution = $state();

  let worker = $state();
  $effect(() => {
    if (!worker) {
      worker = new Worker(new URL('$lib/js/worker.js', import.meta.url), { type: 'module' });
      worker.addEventListener('message', e => solutions = e.data);
    }
  });

  function pickNumber (large = false) {
    if (large) numbers.push(new N(largeBin.pop()));
    else numbers.push(new N(smallBin.pop()));
  }
  
  function pickTarget () {
    target = Math.floor(Math.random() * 899) + 101;
    dispatch('startgame');
    worker.postMessage({ numbers: numbers.map(x => x.value), target });
  }

  function selectNumber (x) {
    if (steps.length === 0 || !(steps.at(-1).a && steps.at(-1).b && !steps.at(-1).o)) {
      x.used = true;

      if (steps.length === 0 || steps.at(-1).c) {
        steps.push({
          a: x,
          o: null,
          b: null,
          c: null
        });
      } else {
        if (!steps.at(-1).a) steps.at(-1).a = x;
        else steps.at(-1).b = x;
      }
    }
  }

  function removeNumber (row, x) {
    if (!steps[row][x]) return;

    steps[row][x].used = false;
    steps[row][x] = null;
    while (steps.length > row + 1) {
      if (steps.at(-1).a) steps.at(-1).a.used = false;
      if (steps.at(-1).b) steps.at(-1).b.used = false;
      steps.pop();
    }

    if (!steps.at(-1).a && !steps.at(-1).b) steps.pop();
  }
  
  function selectOperation (x) {
    if (steps.at(-1).c) {
      selectNumber(steps.at(-1).c);
      steps.at(-1).o = x;
    }
    else if (!steps.at(-1).o) steps.at(-1).o = x;
  }
  
  function removeOperation (row) {
    if (!steps[row].o) return;

    steps[row].o = null;
    while (steps.length > row + 1) {
      if (steps.at(-1).a) steps.at(-1).a.used = false;
      if (steps.at(-1).b) steps.at(-1).b.used = false;
      steps.pop();
    }
  }

  function removeRow (row) {
    for (let i = steps.length - 1; i >= row; i--) {
      if (steps[i].a) steps[i].a.used = false;
      if (steps[i].b) steps[i].b.used = false;
    }

    steps.splice(row, steps.length - row);
  }

  function resetGame () {
    smallBin = shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
    largeBin = shuffleList([25, 50, 75, 100]);

    numbers = [];
    target = undefined;
    steps = [];

    solutions = undefined;
    sampleSolution = undefined;

    dispatch('resetgame');
  }

  function showSolution () {
    sampleSolution = solutions.solutions[Math.floor(Math.random() * solutions.solutions.length)];
  }

  // compute row results
  $effect(() => {
    if (steps.length > 0) {
      if (steps.at(-1).a && steps.at(-1).o && steps.at(-1).b) {
        steps.at(-1).c = new N(
          steps.at(-1).o === '\u002b' ? steps.at(-1).a.value + steps.at(-1).b.value :
          steps.at(-1).o === '\u2212' ? steps.at(-1).a.value - steps.at(-1).b.value :
          steps.at(-1).o === '\u00d7' ? steps.at(-1).a.value * steps.at(-1).b.value :
          steps.at(-1).o === '\u00f7' ? steps.at(-1).a.value / steps.at(-1).b.value :
          undefined
        );
      } else steps.at(-1).c = null;
    }
  });
  
  // mark invalid numbers
  $effect(() => {
    for (let x of numbers.concat(steps.filter(y => y.c).map(y => y.c))) {
      if (x.used) continue;

      x.valid = true;

      if (steps.at(-1) && !steps.at(-1).c) {
        const { a, b, o } = steps.at(-1);

        if (o === '\u2212') {
          if (a && (x.value >= a.value || a.value === x.value * 2)) x.valid = false;
          else if (b && (x.value <= b.value || x.value === b.value * 2)) x.valid = false;
        }
        else if (o === '\u00d7') {
          if (x.value === 1) x.valid = false;
        }
        else if (o === '\u00f7') {
          if (x.value === 1) x.valid = false;
          else if (a && (a.value % x.value !== 0 || a.value === x.value ** 2)) x.valid = false;
          else if (b && (x.value % b.value !== 0 || x.value === b.value ** 2)) x.valid = false;
        }
      }
    }
  });

  let invalidOps = $state({
    '\u002b': true,
    '\u2212': true,
    '\u00d7': true,
    '\u00f7': true
  });

  // mark invalid operations
  $effect(() => {
    if (target === undefined || steps.length === 0 || solved || $done || ((steps.at(-1).a !== null) !== (steps.at(-1).b !== null) && steps.at(-1).o) || (steps.length === 5 && steps.at(-1).c)) {
      invalidOps['\u002b'] = true;
      invalidOps['\u2212'] = true;
      invalidOps['\u00d7'] = true;
      invalidOps['\u00f7'] = true;
    } else {
      invalidOps['\u002b'] = false;
      invalidOps['\u2212'] = false;
      invalidOps['\u00d7'] = false;
      invalidOps['\u00f7'] = false;

      if (steps.at(-1)?.a && steps.at(-1)?.b && !steps.at(-1)?.c) {
        const a = steps.at(-1).a.value;
        const b = steps.at(-1).b.value;

        invalidOps['\u2212'] = a <= b || a === b * 2;
        invalidOps['\u00d7'] = a === 1 || b === 1;
        invalidOps['\u00f7'] = b === 1 || a % b !== 0 || a === b * b;
      }
      else if (steps.at(-1)?.c) {
        const c = steps.at(-1).c.value;
        const x = numbers.filter(y => !y.used).concat(steps.filter(y => y !== steps.at(-1) && y.c && !y.c.used).map(y => y.c)).map(y => y.value);

        invalidOps['\u2212'] = x.every(y => c <= y || c === y * 2);
        invalidOps['\u00d7'] = x.every(y => c === 1 || y === 1);
        invalidOps['\u00f7'] = x.every(y => y === 1 || c % y !== 0 || c === y ** 2);
      }
    }
  });

  // determine if solved
  let solved = $derived(steps.at(-1)?.c?.value === target);

  async function getDaily () {
    const l = Math.floor(Math.random() * 5);
    const s = shuffleList(Array(l).fill(true).concat(Array(6 - l).fill(false)));
    for (let x of s) pickNumber(x);

    await tick();
    
    pickTarget();
  }

  export function getGameState () {
    const squares = numbers.concat(steps.filter(x => x.c).map(x => x.c));
    const stepsAdj = steps.map(s => [squares.indexOf(s.a), s.o, squares.indexOf(s.b)]);

    return {
      numbers: numbers.map(x => x.value),
      target,
      steps: stepsAdj,
      solutions: solutions
    };
  }

  export function applyGameState (gameState) {
    for (let x of gameState.numbers) numbers.push(new N(x));
    target = gameState.target;

    for (let s of gameState.steps) {
      const step = {
        a: null,
        o: null,
        b: null,
        c: null
      };

      if (s[0] > -1) {
        step.a = s[0] < 6 ? numbers[s[0]] : steps[s[0] - 6].c;
        step.a.used = true;
      }
      if (s[1]) step.o = s[1];
      if (s[2] > -1) {
        step.b = s[2] < 6 ? numbers[s[2]] : steps[s[2] - 6].c;
        step.b.used = true;
      }
      if (step.a && step.o && step.b) step.c = new N(
        step.o === '\u002b' ? step.a.value + step.b.value :
        step.o === '\u2212' ? step.a.value - step.b.value :
        step.o === '\u00d7' ? step.a.value * step.b.value :
        step.o === '\u00f7' ? step.a.value / step.b.value :
        undefined
      );

      steps.push(step);
    }

    if (gameState.solutions) solutions = gameState.solutions;
    else {
      worker.postMessage({ numbers: numbers.map(x => x.value), target });
      worker.addEventListener('message', e => {
        dispatch('storesolutions', e.data);
      }, { 'once': true });
    }
  }

  $effect(() => seed.resetGlobal);
</script>

<div class="game" inert={ !$running || solved }>
  <Target value={ target } />

  <div class="board">
    <div class="left">
      <NumberSelection { numbers }
        on:selectnumber={ e => selectNumber(e.detail) }
      />
    </div>

    <div class="right">
      <Steps bind:steps={ steps } { solved }
        on:selectnumber={ e => selectNumber(e.detail) }
        on:removenumber={ e => removeNumber(...e.detail) }
        on:removeoperation={ e => removeOperation(e.detail) }
        on:removerow={ e => removeRow(e.detail) }
      />

      <OperationPanel on:selectoperation={ e => selectOperation(e.detail) } { invalidOps } />
    </div>
  </div>
</div>

<div class="buttons">
  { #if $done }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ showSolution } disabled={ !solutions }>{ solutions ? 'SHOW A SOLUTION' : 'SOLVING\u0133' }</button>
      { #if !daily }
        <button class="text-btn" on:click={ resetGame }>RESET</button>
      { /if }
    </div>
  { :else if daily && target === undefined }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ getDaily }>SHOW TODAY'S NUMBERS</button>
    </div>
  { :else if numbers.length < 6 }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ () => pickNumber() }>SMALL</button>
      <button class="text-btn" on:click={ () => pickNumber(true) } disabled={ largeBin.length === 0 }>LARGE</button>
    </div>
  { :else if target === undefined }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ pickTarget }>GENERATE TARGET</button>
    </div>
  { /if }
</div>

{ #if sampleSolution }
  <div class="solution" transition:fade={ { duration: 150, easing: cssEaseIn } }>
    <span class="a">{ solutions.diff === 0 ? sampleSolution.steps : `${sampleSolution.steps} = ${sampleSolution.value}` }</span>
    { #if solutions.diff !== 0 }
      <span class="b">({ solutions.diff } away)</span>
    { /if }
    <span class="c">({ solutions.solutions.length } solution{ solutions.solutions.length === 1 ? '' : 's' } found)</span>
  </div>
{ /if }

<style>
  .game, .board {
    display: flex;
    gap: 1rem;
  }

  .game {
    flex-direction: column;
  }

  .right {
    width: calc(5 * 3rem + 5 * 0.5rem + 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .buttons {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
  }

  .buttons .wrapper {
    display: flex;
    gap: 0.5rem;
    grid-area: 1 / 1 / 2 / 2;
    backface-visibility: hidden;
  }

  .solution {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .solution .a {
    font-weight: bold;
  }

  .solution .c {
    font-size: 80%;
    font-style: italic;
  }
</style>
