<script>
  import shuffleList from 'shuffle-list';
  import seed from 'seed-random';
  import dayjs from 'dayjs';

  import { createEventDispatcher, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  import LetterSelection from './LetterSelection.svelte';
  import InputArea from './InputArea.svelte';

  const dispatch = createEventDispatcher();

  const running = getContext('running');
  const done = getContext('done');

  let daily = $page.url.pathname.includes('daily');
  if (daily) seed(dayjs().format('YYYY-MM-DD'), { global: true });

  class L {
    used = $state(false);

    constructor (value) {
      this.value = value;
    }
  }

  let vowels = $state(shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split('')));
  let consonants = $state(shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split('')));

  let letters = $state([]);
  let input = $state([]);

  let solutions = $state([]);
  let showSolutions = $state(false);

  let worker = $state();
  $effect(() => {
    if (!worker) {
      worker = new Worker(new URL('$lib/js/worker.js', import.meta.url), { type: 'module' });
      worker.addEventListener('message', e => solutions = e.data);
    }
  });

  function pickLetter (vowel = false) {
    if (vowel) letters.push(new L(vowels.pop()));
    else letters.push(new L(consonants.pop()));
    if (letters.length === 9) {
      dispatch('startgame');
      worker.postMessage({ letters: letters.map(x => x.value) });
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

  function resetGame () {
    vowels = shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split(''));
    consonants = shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split(''));

    letters = [];
    input = [];

    solutions = undefined;
    showSolutions = false;

    dispatch('resetgame');
  }

  function getDaily () {
    const v = Math.floor(Math.random() * 3) + 3;
    const s = shuffleList(Array(v).fill(true).concat(Array(9 - v).fill(false)));
    for (let x of s) pickLetter(x);
  }

  export function getGameState () {
    return {
      letters: letters.map(x => x.value),
      input: input.map(x => letters.indexOf(x)),
      solutions: solutions
    };
  }

  export function applyGameState (gameState) {
    for (let x of gameState.letters) letters.push(new L(x));
    for (let x of gameState.input) selectLetter(letters[x]);
    solutions = gameState.solutions;
  }
</script>

<svelte:window on:keydown={ e => {
  if (!$running) return;
  
  if (e.key === 'Backspace') removeLetter();
  else if (e.key === 'Delete') clearWord();
  else {
    const x = letters.find(y => !y.used && y.value === e.key.toUpperCase());
    if (x) selectLetter(x);
  }
} } />

<div class="game" inert={ !$running }>
  <LetterSelection value={ letters }
    on:selectletter={ e => selectLetter(e.detail) }
  />

  <InputArea value={ input }
    on:removeletter={ () => removeLetter() }
    on:clearword={ () => clearWord() }
  />
</div>

<div class="buttons">
  { #if $done }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ () => showSolutions = true } disabled={ !solutions }>{ solutions ? 'SHOW LONGEST WORDS' : 'SOLVING\u0133' }</button>
      { #if !daily }
        <button class="text-btn" on:click={ resetGame }>RESET</button>
      { /if }
    </div>
  { :else if daily && letters.length === 0 }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ getDaily }>SHOW TODAY'S LETTERS</button>
    </div>
  { :else if letters.length < 9 }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button class="text-btn" on:click={ () => pickLetter(true) } disabled={ letters.filter(x => 'AEIOU'.includes(x.value)).length === 5 }>VOWEL</button>
      <button class="text-btn" on:click={ () => pickLetter() } disabled={ letters.filter(x => !'AEIOU'.includes(x.value)).length === 6 }>CONSONANT</button>
    </div>
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
