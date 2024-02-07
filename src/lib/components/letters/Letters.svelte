<script>
  import { createEventDispatcher, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import shuffleList from 'shuffle-list';

  import flip from '$lib/js/flipTransition.js';
  import { cssEaseIn, cssEaseOut } from '$lib/js/cssEase.js';

  import LetterSelection from './LetterSelection.svelte';
  import InputArea from './InputArea.svelte';

  const dispatch = createEventDispatcher();

  const running = getContext('running');
  const done = getContext('done');

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
      <button on:click={ () => showSolutions = true } disabled={ !solutions }>{ solutions ? 'SHOW LONGEST WORDS' : 'SOLVING\u0133' }</button>
      <button on:click={ () => resetGame() }>RESET</button>
    </div>
  { :else if letters.length < 9 }
    <div class="wrapper" in:flip={ { duration: 300, easing: cssEaseIn } } out:flip={ { duration: 300, easing: cssEaseOut, from: 0, to: 180 } }>
      <button on:click={ () => pickLetter(true) } disabled={ letters.filter(x => 'AEIOU'.includes(x.value)).length === 5 }>VOWEL</button>
      <button on:click={ () => pickLetter() } disabled={ letters.filter(x => !'AEIOU'.includes(x.value)).length === 6 }>CONSONANT</button>
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

  .buttons button {
    padding: 0.4rem 0.6rem;
    border: 0.075rem solid var(--theme-color);
    border-radius: 0.6rem;
    font-weight: bold;
    color: var(--theme-color);
    transition-property: background, filter, opacity;
    transition-duration: 0.15s;
  }

  .buttons button:hover {
    background: var(--theme-color-light);
  }

  .buttons button:disabled {
    filter: grayscale(1);
    opacity: 0.5;
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
