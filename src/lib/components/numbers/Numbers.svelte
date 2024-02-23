<script>
  import shuffleList from 'shuffle-list';
  import seed from 'seed-random';
  import dayjs from 'dayjs';

  import { tick, onMount, onDestroy, unstate } from 'svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';
  import dailyStore from '$lib/js/daily.js';

  import Timer from '$lib/components/Timer.svelte';
  import Score from '$lib/components/arcade/Score.svelte';
  import Target from '$lib/components/numbers/Target.svelte';
  import Skip from '$lib/components/arcade/Skip.svelte';
  import NumberSelection from '$lib/components/numbers/NumberSelection.svelte';
  import Steps from '$lib/components/numbers/Steps.svelte';
  import OperationPanel from '$lib/components/numbers/OperationPanel.svelte';

  let gameMode = $page.url.pathname.split('/')[1];

  if (gameMode === 'daily') seed(dayjs().format('YYYY-MM-DD'), { global: true });

  class N {
    used = $state(false);
    valid = $state(true);

    constructor (value) {
      this.value = value;
    }
  }

  let smallBin = $state(shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]));
  let largeBin = $state(shuffleList([25, 50, 75, 100]));

  let timer = $state();
  let running = $state(false);
  let done = $state(false);

  let numbers = $state([]);
  let target = $state();
  let steps = $state([]);

  let solutions = $state();
  let sampleSolution = $state();

  let worker = $state();

  async function solve () {
    const currNumbers = unstate(numbers).map(x => x.value);
    const currTarget = unstate(target);

    worker.postMessage({ numbers: currNumbers, target: currTarget });

    solutions = await new Promise(resolve => {
      function handler (e) {
        if (currTarget !== target || currNumbers.some((_, i, a) => a[i] !== numbers[i].value)) {
          worker.removeEventListener('message', handler);
          return;
        }

        const data = e.data;
        if (data.target === currTarget && data.numbers.every((_, i, a) => a[i] === currNumbers[i])) {
          resolve({
            solutions: data.solutions,
            diff: data.diff
          });
          
          worker.removeEventListener('message', handler);
        }
      }

      worker.addEventListener('message', handler);
    });
  }

  function pickNumber (large = false) {
    if (large) numbers.push(new N(largeBin.pop()));
    else numbers.push(new N(smallBin.pop()));
  }
  
  function pickTarget () {
    target = Math.floor(Math.random() * 899) + 101;
    solve();
    startGame();
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

  function startGame () {
    running = true;
    timer.start();
  }

  function resetGame () {
    smallBin = shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
    largeBin = shuffleList([25, 50, 75, 100]);

    numbers = [];
    target = undefined;
    steps = [];

    solutions = undefined;
    sampleSolution = undefined;

    if (gameMode === 'arcade') {
      arcadeDifficulty = undefined;
      score.reset();
      skip.reset();
    }

    done = false;
    timer.reset();
  }

  function showSolution () {
    sampleSolution = solutions.solutions[Math.floor(Math.random() * solutions.solutions.length)];
  }

  function combine (a, b, o) {
    const av = a.value;
    const bv = b.value;

    if (o === '\u002b') return new N(av + bv);
    if (o === '\u2212' && av > bv && av !== bv * 2) return new N(av - bv);
    if (o === '\u00d7' && av !== 1 && bv !== 1) return new N(av * bv);
    if (o === '\u00f7' && bv !== 1 && av % bv === 0 && av !== bv ** 2) return new N(av / bv);

    return null;
  }

  let validOps = $state({
    '\u002b': false,
    '\u2212': false,
    '\u00d7': false,
    '\u00f7': false
  });

  // compute step results + mark operations / numbers as valid
  $effect(() => {
    if (solved) {
      for (let o in validOps) validOps[o] = false;
      return;
    }

    const lastStep = steps.at(-1);
    const allNumbers = numbers.concat(steps.filter(x => x.c).map(x => x.c)).filter(x => !x.used);

    if (!lastStep || steps?.[5]?.c) {
      for (let o in validOps) validOps[o] = false;
      for (let n of allNumbers) n.valid = true;
      return;
    }

    if (lastStep.c) {
      for (let n of allNumbers) n.valid = true;
    }
    
    if (!lastStep.o) {
      lastStep.c = null;
      for (let n of allNumbers) n.valid = true;

      if (lastStep.a && lastStep.b) {
        for (let o in validOps) validOps[o] = combine(lastStep.a, lastStep.b, o) !== null;
      } else {
        for (let o in validOps) validOps[o] = allNumbers.some(n => combine(lastStep.a ?? n, lastStep.b ?? n, o) !== null);
      }
    }
    else {
      if (!lastStep.c) {
        for (let o in validOps) validOps[o] = false;
      }
      
      if (lastStep.a && lastStep.b && !lastStep.c) {
        lastStep.c = combine(lastStep.a, lastStep.b, lastStep.o);
        for (let o in validOps) validOps[o] = steps.length === 5 ? false : allNumbers.some(n => combine(lastStep.c, n, o) !== null);
      }
      else if (!lastStep.a || !lastStep.b) {
        lastStep.c = null;
        for (let n of allNumbers) n.valid = combine(lastStep.a ?? n, lastStep.b ?? n, lastStep.o) !== null;
      }
    }
  });

  // determine if solved
  let solved = $derived(target && steps.at(-1)?.c?.value === target);
  $effect(() => {
    if (gameMode === 'arcade' && solved) {
      for (let i = 0; i < numbers.length; i++) {
        const n = numbers[i];
        if (!n.used) continue;

        if (n.value > 10) {
          largeBin.push(n.value);
          largeBin = shuffleList(largeBin);
        } else {
          smallBin.push(n.value);
          smallBin = shuffleList(smallBin);
        }

        numbers[i] = new N(((Math.random() < 0.3 && largeBin.length > 0) ? largeBin : smallBin).pop());
      }

      removeRow(0);
      score.add();
      skip.refill();
      pickArcadeTarget();
      timer.add(5 + (arcadeDifficulty - 3) * 2.5);
    }
  });

  /* === ARCADE MODE === */

  let arcadeDifficulty = $state();
  let score = $state();
  let skip = $state();

  function pickArcadeTarget () {
    const min = { 3: 50, 4: 100, 5: 100 };
    const max = { 3: 500, 4: 1000, 5: 1000 };

    function helper (num) {
      if (num.length === 1) return num[0];

      const shuffled = shuffleList(num);
      const [a, b] = shuffled.slice(0, 2);
      let newNum;

      for (let o of shuffleList('+-*/'.split(''))) {
        if (o === '+') newNum = a + b;
        else if (o === '-') {
          if (a > b && a !== b * 2) newNum = a - b;
        }
        else if (o === '*') {
          if (a !== 1 && b !== 1) newNum = a * b;
        }
        else if (o === '/') {
          if (b !== 1 && a % b === 0 && a !== b ** 2) newNum = a / b;
        }
        
        if (newNum) break;
      }

      return helper(shuffled.slice(2).concat(newNum));
    }

    let i = 0;
    while (true) {
      const t = helper(shuffleList(numbers.map(x => x.value)).slice(0, arcadeDifficulty));
      const x = t !== target && numbers.every(n => n.value !== t);
      if (i === 9 || (t > min[arcadeDifficulty] && t < max[arcadeDifficulty] && x)) {
        target = t;
        solutions = undefined;
        solve();
        break;
      }
      if (x) i++;
    }
  }

  function startArcade (diff) {
    arcadeDifficulty = diff;
    while (numbers.length < 6) pickNumber(Math.random() < 0.3 && largeBin.length > 0);

    tick().then(() => {
      pickArcadeTarget();
      startGame();
      skip.start();
    });
  }

  /* === DAILY MODE === */

  function getDaily () {
    const l = Math.floor(Math.random() * 5);
    const s = shuffleList(Array(l).fill(true).concat(Array(6 - l).fill(false)));
    for (let x of s) pickNumber(x);

    tick().then(pickTarget);
  }

  function saveDaily () {
    const squares = numbers.concat(steps.filter(x => x.c).map(x => x.c));
    const stepsAdj = steps.map(s => [squares.indexOf(s.a), s.o, squares.indexOf(s.b)]);

    $dailyStore['numbers'] = {
      numbers: numbers.map(x => x.value),
      target,
      steps: stepsAdj,
      solutions: solutions
    };
  }

  function applyDaily () {
    const gameState = $dailyStore['numbers'];

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
    else solve();
  }

  /* === LIFECYCLE === */

  onMount(() => {
    if (gameMode !== 'daily' || (gameMode === 'daily' && !$dailyStore?.['numbers']?.['solutions'])) {
      worker = new Worker(new URL('$lib/js/worker.js', import.meta.url), { type: 'module' });
    }

    if (gameMode === 'daily' && $dailyStore['date'] === dayjs().format('YYYY-MM-DD') && 'numbers' in $dailyStore) {
      applyDaily();
      done = true;
      timer.drain();
    }
  });

  onDestroy(() => {
    if (gameMode === 'daily') seed.resetGlobal();
  });
</script>

<svelte:window
  onbeforeunload={ () => {
    if (gameMode === 'daily' && running) saveDaily();
  } }
/>

<Timer bind:this={ timer }
  onTimerDone={ () => {
    running = false;
    done = true;
    for (let o in validOps) validOps[o] = false;

    if (gameMode === 'daily') saveDaily();
    if (gameMode === 'arcade') skip.freeze();
  } }
/>

<div class="game" inert={ !running || solved }>
  <div class="top">
    { #if gameMode === 'arcade' }
      <Score bind:this={ score } />
    { /if }

    <Target value={ target } />

    { #if gameMode === 'arcade' }
      <Skip bind:this={ skip }
        onclick={ () => {
          pickArcadeTarget();
          removeRow(0);
        } }
      />
    { /if }
  </div>

  <div class="board">
    <div class="left">
      <NumberSelection { numbers }
        onSelectNumber={ selectNumber }
      />
    </div>

    <div class="right">
      <Steps { steps } { solved }
        onSelectNumber={ selectNumber }
        onRemoveNumber={ removeNumber }
        onRemoveOperation={ removeOperation }
        onRemoveRow={ removeRow }
      />

      <OperationPanel { validOps }
        onSelectOperation={ selectOperation }
      />
    </div>
  </div>
</div>

<div class="buttons">
  { #if done }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" disabled={ !solutions } onclick={ showSolution }>
        { solutions ? 'SHOW A SOLUTION' : 'SOLVING\u2026' }
      </button>

      { #if gameMode !== 'daily' }
        <button class="text-btn" onclick={ resetGame }>
          { gameMode === 'arcade' ? 'PLAY AGAIN' : 'RESET' }
        </button>
      { /if }
    </div>
  { :else if gameMode === 'classic' }
    { #if numbers.length < 6 }
      <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <button class="text-btn" onclick={ () => pickNumber() }>
          SMALL
        </button>
        <button class="text-btn" disabled={ largeBin.length === 0 } onclick={ () => pickNumber(true) }>
          LARGE
        </button>
      </div>
    { :else if target === undefined }
      <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <button class="text-btn" onclick={ pickTarget }>
          GENERATE TARGET
        </button>
      </div>
    { /if }
  { :else if gameMode === 'daily' }
    { #if !target }
      <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <button class="text-btn" onclick={ getDaily }>
          SHOW TODAY&CloseCurlyQuote;S NUMBERS
        </button>
      </div>
    { /if }
  { :else if gameMode === 'arcade' }
    { #if !running }
      <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <button class="text-btn" onclick={ () => startArcade(3) }>
          EASY
        </button>
        <button class="text-btn" onclick={ () => startArcade(4) }>
          MEDIUM
        </button>
        <button class="text-btn" onclick={ () => startArcade(5) }>
          HARD
        </button>
      </div>
    { /if }
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

  .top {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 1fr min-content 1fr;
    align-items: center;
    justify-items: center;
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
