<script>
  import shuffleList from 'shuffle-list';

  import { getContext, tick } from 'svelte';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  import Score from '$lib/components/arcade/Score.svelte';
  import Target from '$lib/components/numbers/Target.svelte';
  import Skip from '$lib/components/arcade/Skip.svelte';
  import NumberSelection from '$lib/components/numbers/NumberSelection.svelte';
  import Steps from '$lib/components/numbers/Steps.svelte';
  import OperationPanel from '$lib/components/numbers/OperationPanel.svelte';

  let { onStartGame, onResetGame, onSolve } = $props();

  const running = getContext('running');
  const done = getContext('done');

  class N {
    used = $state(false);
    valid = $state(true);

    constructor (value) {
      this.value = value;
    }

    static combine (a, b, o) {
      const inv = { '+': '-', '-': '+', '*': '/', '/': '*' };

      let value;

      if (o === '+') value = a.value + b.value;
      if (o === '-') {
        if (a.value <= b.value) return;
        if (a.value === b.value * 2) return;
        value = a.value - b.value;
      }
      if (o === '*') {
        if (a.value === 1) return;
        if (b.value === 1) return;
        value = a.value * b.value;
      }
      if (o === '/') {
        if (b.value === 1) return;
        if (a.value % b.value !== 0) return;
        if (a.value === b.value ** 2) return;
        value = a.value / b.value;
      }

      const op1 = [];
      const op2 = [];

      if ([o, inv[o]].includes(a.steps.find(x => typeof x === 'string'))) {
        for (let i = 0; i < a.steps.length; i += 2) {
          if (i === 0) op1.push(a.steps[i]);
          else {
            if ('+*'.includes(a.steps[i - 1])) op1.push(a.steps[i]);
            else op2.push(a.steps[i]);
          }
        }
      } else op1.push(a);

      if ([o, inv[o]].includes(b.steps.find(x => typeof x === 'string'))) {
        for (let i = 0; i < b.steps.length; i += 2) {
          if (i === 0) {
            if ('+*'.includes(o)) op1.push(b.steps[i]);
            else op2.push(b.steps[i]);
          } else {
            if (b.steps[i - 1] === o) op1.push(b.steps[i]);
            else op2.push(b.steps[i]);
          }
        }
      } else {
        if ('+*'.includes(o)) op1.push(b);
        else op2.push(b);
      }

      const steps = [];
      const p = '+*'.includes(o) ? o : inv[o];
      op1.sort(N.sort).forEach(x => { steps.push(p); steps.push(x); });
      op2.sort(N.sort).forEach(x => { steps.push(inv[p]); steps.push(x); });
      steps.shift();

      return new N(value, steps);
    }
  }

  let difficulty = $state();
  let score = $state();
  let skip = $state();

  let smallBin = $state(shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]));
  let largeBin = $state(shuffleList([25, 50, 75, 100]));

  let numbers = $state([]);
  let target = $state();
  let steps = $state([]);

  let solutions = $state();
  let sampleSolution = $state();

  function pickNumber (large = false) {
    if (large) numbers.push(new N(largeBin.pop()));
    else numbers.push(new N(smallBin.pop()));
  }
  
  function pickTarget () {
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

    while (true) {
      const t = helper(shuffleList(numbers.map(x => x.value)).slice(0, difficulty));
      if (t > min[difficulty] && t < max[difficulty] && numbers.every(x => x !== t)) {
        target = t;
        break;
      }
    }
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

  async function startGame (diff) {
    difficulty = diff;
    while (numbers.length < 6) pickNumber(Math.random() < 0.3 && largeBin.length > 0);

    await tick();

    pickTarget();
    skip.start();
    onStartGame();
  }

  function resetGame () {
    difficulty = undefined;

    smallBin = shuffleList([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
    largeBin = shuffleList([25, 50, 75, 100]);

    numbers = [];
    target = undefined;
    steps = [];

    solutions = undefined;
    sampleSolution = undefined;

    score.reset();
    skip.reset();
    onResetGame();
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
  let solved = $derived(target && steps.at(-1)?.c?.value === target);
  $effect(() => {
    if (solved) {
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

      pickTarget();
      steps = [];
      score.add();
      skip.refill();
      onSolve(difficulty);
    }
  });
</script>

<div class="game" inert={ !$running }>
  <div class="top">
    <Score bind:this={ score } />
    <Target value={ target } />
    <Skip bind:this={ skip } onclick={ () => {
      pickTarget();
      skip.refill();
    } } />
  </div>

  <div class="board">
    <div class="left">
      <NumberSelection { numbers }
        onSelectNumber={ selectNumber }
      />
    </div>

    <div class="right">
      <Steps bind:steps={ steps } { solved }
        onSelectNumber={ selectNumber }
        onRemoveNumber={ removeNumber }
        onRemoveOperation={ removeOperation }
        onRemoveRow={ removeRow }
      />

      <OperationPanel { invalidOps }
        onSelectOperation={ selectOperation }
      />
    </div>
  </div>
</div>

<div class="buttons">
  { #if $done }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" onclick={ resetGame }>
        PLAY AGAIN
      </button>
    </div>
  { :else if !$running }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" onclick={ () => startGame(3) }>
        EASY
      </button>
      <button class="text-btn" onclick={ () => startGame(4) }>
        MEDIUM
      </button>
      <button class="text-btn" onclick={ () => startGame(5) }>
        HARD
      </button>
    </div>
  { /if }
</div>

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
    gap: 1rem;
    align-items: center;
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
</style>
