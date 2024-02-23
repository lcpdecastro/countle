<script>
  import shuffleList from 'shuffle-list';
  import seed from 'seed-random';
  import dayjs from 'dayjs';

  import { onMount, onDestroy, unstate } from 'svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';
  import dailyStore from '$lib/js/daily.js';

  import Timer from '$lib/components/Timer.svelte';
  import LetterSelection from '$lib/components/letters/LetterSelection.svelte';
  import InputArea from '$lib/components/letters/InputArea.svelte';

  let gameMode = $page.url.pathname.split('/')[1];

  if (gameMode === 'daily') seed(dayjs().format('YYYY-MM-DD'), { global: true });

  class L {
    used = $state(false);

    constructor (value) {
      this.value = value;
    }
  }

  let vowels = $state(shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split('')));
  let consonants = $state(shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split('')));

  let timer = $state();
  let running = $state(false);
  let done = $state(false);

  let letters = $state([]);
  let input = $state([]);

  let solutions = $state([]);
  let showSolutions = $state(false);

  let worker = $state();

  async function solve () {
    const currLetters = unstate(letters).map(x => x.value);

    worker.postMessage({ letters: currLetters });

    solutions = await new Promise(resolve => {
      function handler (e) {
        if (currLetters.some((_, i, a) => a[i] !== letters[i].value)) {
          worker.removeEventListener('message', handler);
          return;
        }

        const data = e.data;
        if (data.letters.every((_, i, a) => a[i] === currLetters[i])) {
          resolve({
            longest: data.longest,
            words: data.words
          });
          
          worker.removeEventListener('message', handler);
        }
      }

      worker.addEventListener('message', handler);
    });
  }

  function pickLetter (vowel = false) {
    if (vowel) letters.push(new L(vowels.pop()));
    else letters.push(new L(consonants.pop()));

    if (letters.length === 9) {
      solve();
      startGame();
    }
  }

  function selectLetter (x) {
    x.used = true;
    input.push(x);
  }

  function removeLetter () {
    input.pop().used = false;
  }

  function clearWord () {
    input.forEach(x => x.used = false);
    input.length = 0;
  }

  function startGame () {
    running = true;
    timer.start();
  }

  function resetGame () {
    vowels = shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split(''));
    consonants = shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split(''));

    letters = [];
    input = [];

    solutions = undefined;
    showSolutions = false;

    done = false;
    timer.reset();
  }

  /* === ARCADE MODE === */

  let arcadeDifficulty = $state();
  let score = $state();

  function startArcade (diff) {
    // TODO!
    return;
  }

  /* === DAILY MODE === */

  function getDaily () {
    const v = Math.floor(Math.random() * 3) + 3;
    const s = shuffleList(Array(v).fill(true).concat(Array(9 - v).fill(false)));
    for (let x of s) pickLetter(x);
  }

  function saveDaily () {
    $dailyStore['letters'] = {
      letters: letters.map(x => x.value),
      input: input.map(x => letters.indexOf(x)),
      solutions: solutions
    };
  }

  function applyDaily () {
    const gameState = $dailyStore['letters'];

    for (let x of gameState.letters) letters.push(new L(x));
    for (let x of gameState.input) selectLetter(letters[x]);
    solutions = gameState.solutions;
  }

  /* === LIFECYCLE === */

  onMount(() => {
    if (gameMode !== 'daily' || (gameMode === 'daily' && !$dailyStore?.['letters']?.['solutions'])) {
      worker = new Worker(new URL('$lib/js/worker.js', import.meta.url), { type: 'module' });
    }

    if (gameMode === 'daily' && $dailyStore['date'] === dayjs().format('YYYY-MM-DD') && 'letters' in $dailyStore) {
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
  onkeydown={ e => {
    if (!running) return;
    
    if (e.key === 'Backspace') removeLetter();
    else if (e.key === 'Delete') clearWord();
    else {
      const x = letters.find(y => !y.used && y.value === e.key.toUpperCase());
      if (x) selectLetter(x);
    }
  } }
  onbeforeunload={ () => {
    if (gameMode === 'daily' && running) saveDaily();
  } }
/>

<Timer bind:this={ timer }
  onTimerDone={ () => {
    running = false;
    done = true;

    if (gameMode === 'daily') saveDaily();
  } }
/>

<div class="game" inert={ !running }>
  <LetterSelection { letters }
    onSelectLetter={ x => selectLetter(x) }
  />

  <InputArea { input } active={ running }
    onRemoveLetter={ removeLetter }
    onClearWord={ clearWord }
  />
</div>

<div class="buttons">
  { #if done }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" disabled={ !solutions } onclick={ () => showSolutions = true }>
        { solutions ? 'SHOW LONGEST WORDS' : 'SOLVING\u2026' }
      </button>

      { #if gameMode !== 'daily' }
        <button class="text-btn" onclick={ resetGame }>
          RESET
        </button>
      { /if }
    </div>
  { :else if gameMode === 'classic' }
    { #if letters.length < 9 }
      <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <button class="text-btn" disabled={ letters.filter(x => 'AEIOU'.includes(x.value)).length === 5 } onclick={ () => pickLetter(true) }>
          VOWEL
        </button>
        <button class="text-btn" disabled={ letters.filter(x => !'AEIOU'.includes(x.value)).length === 6 } onclick={ () => pickLetter() }>
          CONSONANT
        </button>
      </div>
    { /if }
  { :else if gameMode === 'daily' }
    { #if letters.length === 0 }
      <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
        <button class="text-btn" onclick={ getDaily }>
          SHOW TODAY&CloseCurlyQuote;S LETTERS
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

{ #if showSolutions }
  <div class="solution" transition:fade={ { duration: 150, easing: cssEaseIn } }>
    <span class="a">
      { #each solutions.words as x }
        <span>{ x.toUpperCase() }</span>
      { /each }
    </span>
    <span class="c">({ solutions.words.length } { solutions.longest }-letter word{ solutions.words.length === 1 ? '' : 's' } found)</span>
  </div>
{ /if }

<style>
  .game {
    width: 100%;
    display: flex;
    gap: 1rem;
    flex-direction: column;
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
    display: flex;
    gap: 0.25rem 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .solution .c {
    font-size: 80%;
    font-style: italic;
  }
</style>
