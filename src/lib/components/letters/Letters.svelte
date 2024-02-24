<script>
  import shuffleList from 'shuffle-list';
  import seed from 'seed-random';
  import dayjs from 'dayjs';

  import { onMount, onDestroy, unstate } from 'svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';
  import dictionary from '$lib/js/en_US.js';
  import dailyStore from '$lib/js/daily.js';

  import Timer from '$lib/components/Timer.svelte';
  import Score from '$lib/components/arcade/Score.svelte';
  import Reroll from '$lib/components/arcade/Reroll.svelte';
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

  let vowels = $state();
  let consonants = $state();
  let digrams = $state();
  let trigrams = $state();

  let timer = $state();
  let running = $state();
  let done = $state();

  let letters = $state();
  let input = $state();

  let solutions = $state();
  let showSolutions = $state();

  function resetStates () {
    vowels = shuffleList(['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'U', 'U']);
    consonants = shuffleList(['S', 'S', 'S', 'S', 'S', 'S', 'R', 'R', 'R', 'R', 'R', 'R', 'N', 'N', 'N', 'N', 'N', 'T', 'T', 'T', 'T', 'T', 'L', 'L', 'L', 'L', 'C', 'C', 'C', 'C', 'D', 'D', 'D', 'G', 'G', 'G', 'P', 'P', 'P', 'M', 'M', 'M', 'H', 'H', 'B', 'B', 'Y', 'Y', 'F', 'F', 'V', 'K', 'W', 'Z', 'X', 'Q', 'J']);
    digrams = shuffleList(['IN', 'IN', 'ER', 'ER', 'ES', 'ES', 'NG', 'NG', 'TI', 'TI', 'ED', 'ED', 'TE', 'TE', 'RE', 'RE', 'AT', 'AT', 'ON', 'ST', 'EN', 'LE', 'RA', 'RI', 'AN', 'AL', 'LI', 'AR', 'IS', 'NT', 'NE', 'OR', 'DE', 'CO', 'RS', 'IC', 'RO', 'IO', 'IE', 'IT', 'LA', 'SE', 'NS', 'SS', 'LY', 'CA', 'DI', 'UN', 'VE', 'TA', 'HE', 'OU', 'LL', 'TR', 'PE', 'ME', 'EL', 'EA', 'CH']);
    trigrams = shuffleList(['ING', 'ING', 'ERS', 'ION', 'ATI', 'TIO', 'TER', 'ATE', 'ESS', 'ENT', 'TIN', 'EST', 'NES', 'IES', 'TED', 'IST', 'ONS', 'CON', 'RES', 'INE', 'ALL', 'LIN', 'VER', 'OUS', 'PER', 'BLE', 'RAT', 'LES', 'ICA', 'MEN', 'RIN']);
    
    running = false;
    done = false;
    
    letters = [];
    input = [];
    
    solutions = undefined;
    showSolutions = false;
  }

  resetStates();

  let worker = $state();

  async function solve () {
    solutions = undefined;

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
    resetStates();
    timer.reset();

    if (gameMode === 'arcade') {
      arcadeDifficulty = undefined;
      score.reset();
      skip.reset();
    }
  }

  let inputWord = $derived(input.map(x => x.value).join(''));
  let invalid = $derived(inputWord.length > 0 && !dictionary.has(inputWord.toLowerCase()));

  /* === ARCADE MODE === */

  let arcadeDifficulty = $state();
  let score = $state();
  let skip = $state();

  function startArcade (diff) {
    arcadeDifficulty = diff;
    while (letters.length < 9) letters.push(new L(pickArcadeLetter()));
    letters = shuffleList(letters);

    solve();
    startGame();
    skip.start();
  }

  function pickArcadeLetter () {
    const { v, c, d, t } = letters.reduce((p, x) => {
      if (x) {
        if (x.value.length === 1 && 'AEIOU'.includes(x.value)) p.v++;
        else if (x.value.length === 1) p.c++;
        else if (x.value.length === 2) p.d++;
        else if (x.value.length === 3) p.t++;
      }

      return p;
    }, { v: 0, c: 0, d: 0, t: 0 });
    
    if (arcadeDifficulty > 2 && t < 1 && c >= 3 && v >= 2) return trigrams.pop();
    if (arcadeDifficulty > 1 && d < 2 && c >= 3 && v >= 2) return digrams.pop();
    if (c === 6 || (Math.random() < 0.4 && v < 5)) return vowels.pop();
    return consonants.pop();
  }

  function enterWord () {
    for (let i = 0; i < 9; i++) {
      const letter = letters[i];
      if (!letter.used) continue;

      const value = letter.value;
      
      if (value.length === 1 && 'AEIOU'.includes(value)) vowels = shuffleList(vowels.concat(value));
      else if (value.length === 1) consonants = shuffleList(consonants.concat(value));
      else if (value.length === 2) digrams = shuffleList(digrams.concat(value));
      else if (value.length === 3) trigrams = shuffleList(trigrams.concat(value));

      letters[i] = undefined;
    }

    for (let i = 0; i < 9; i++) {
      if (!letters[i]) letters[i] = new L(pickArcadeLetter());
    }

    score.add();
    timer.add(letters.every(x => x.used) ? 30 : inputWord.length);
    skip.refill();
    
    clearWord();
    solve();
  }

  function rerollLetters () {
    input.length = 0;
    letters.length = 0;
    while (letters.length < 9) letters.push(new L(pickArcadeLetter()));
    letters = shuffleList(letters);
    
    solve();
    skip.refill();
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
  onbeforeunload={ () => {
    if (gameMode === 'daily' && running) saveDaily();
  } }
/>

<Timer bind:this={ timer }
  onTimerDone={ () => {
    running = false;
    done = true;

    if (gameMode === 'daily') saveDaily();
    if (gameMode === 'arcade') skip.freeze();
  } }
/>

<div class="game" inert={ !running }>
  <LetterSelection { letters }
    onSelectLetter={ x => selectLetter(x) }
  />

  { #if gameMode === 'arcade' }
    <div class="arcade-buttons" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <div style:justify-self="end">
        <Reroll onclick={ rerollLetters } bind:this={ skip } />
      </div>

      <div style:width="4rem">
        <Score bind:this={ score } />
      </div>

      <button class="text-btn submit" disabled={ inputWord.length === 0 || invalid } onclick={ enterWord }>
        SUBMIT
      </button>
    </div>
  { /if }
    
  <InputArea { input } active={ running } { invalid }
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
        <button class="text-btn" onclick={ () => startArcade(1) }>
          EASY
        </button>
        <button class="text-btn" onclick={ () => startArcade(2) }>
          MEDIUM
        </button>
        <button class="text-btn" onclick={ () => startArcade(3) }>
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

  .arcade-buttons {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 1fr max-content 1fr;
    align-items: center;
    gap: 1rem;
  }

  .submit {
    width: min-content;
    justify-self: start;
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
