<script>
  import Help from 'lucide-svelte/icons/help-circle';
  import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
  import AlertCircle from 'lucide-svelte/icons/alert-circle';

  import Dialog from '$lib/components/Dialog.svelte';

  import { page } from '$app/stores';

  let dialog = $state();
  let gameType = $derived($page.url.pathname.split('/')[2]);
  let gameMode = $derived($page.url.pathname.split('/')[1]);
</script>

{ #snippet dailyNote() }
  <span class="note note-red">
    <p class="note-title">
      <AlertTriangle size="1rem" />
      <b>IMPORTANT NOTE</b>
    </p>
    <p>
      If you abandon a Daily game by reloading or visiting a different page while the timer is running, your game will be saved in its current state and will <b>no longer</b> be playable!
    </p>
  </span>
{ /snippet }

<Dialog bind:this={ dialog }>
  <svelte:fragment slot="title">
    Instructions
  </svelte:fragment>

  <svelte:fragment slot="body">
    { #if gameType === 'numbers' }
      { #if gameMode === 'classic' }
        <p>
          Welcome to <b>Countle: Numbers</b>, where your goal is to get as close as possible to a target three-digit number using six randomly selected numbers.
          Although you get to choose whether to reveal a small or large number, the numbers you <i>actually</i> get are completely random, so good luck!
        </p>
      { :else if gameMode === 'daily' }
        <p>
          Welcome to <b>Countle: Daily Numbers</b>, where your goal is to get as close as possible to a target three-digit number using six randomly selected numbers.
          Everyone in the world will get the same numbers and target everyday, but you won&CloseCurlyQuote;t know what they are until you actually start the game, so good luck!
        </p>
      { :else if gameMode === 'arcade' }
        <p>
          Welcome to <b>Countle: Arcade Numbers</b>, where your goal is to complete as many Numbers rounds as possible before time runs out.
          When you successfully solve a round, a new one comes out immediately, so solve them as fast as you can!
        </p>
      { /if }

      <h2>Number selection</h2>
      { #if gameMode === 'classic'}
        <p>
          At the beginning of every round, you get to choose six numbers from two bins: <b>large numbers</b>, containing 25, 50, 75, and 100; and <b>small numbers</b>, containing two each of the numbers from 1 to 10.
          You get to choose how many of each you want&mdash;you can even choose to have four large numbers, or none at all!
        </p>
        <p>
          After choosing your six numbers, you then generate a random three-digit number from 101 to 999.
        </p>
      { :else if gameMode === 'daily' }
        <p>
          Unlike a regular Numbers game, every player gets the same numbers and target for the daily Numbers games, just like how everyone in the world gets the same <i>Wordle</i> puzzle everyday.
          All you have to do is push a button to reveal them!
        </p>
      { :else if gameMode === 'arcade' }
        <p>
          Unlike a regular Numbers game, the numbers are randomly chosen across the small and large number bins.
          Also, unlike a regular Numbers game, where the target is selected completely at random, the targets in Arcade mode are <i>guaranteed</i> to be solvable.
        </p>
        <p>
          <b>Easy</b> games guarantee an exact solution within two steps, <b>medium</b> games in three, and <b>hard</b> games in four.
          Your solution, however, will not be limited in number of steps.
        </p>
        <span class="note note-yellow">
          <p class="note-title">
            <AlertCircle size="1rem" />
            <b>NOTE</b>
          </p>
          <p>
            As much as possible, the game will try to randomly generate a reachable target between 101 and 999.
            However, this may not always be possible, especially in easy mode.
            As such, easy mode targets will try to be generated between 51 and 499 instead.
          </p>
          <p>
            The game will try to generate targets within these limits a few times.
            If it can&CloseCurlyQuote;t, the last target it generates will be the new target regardless.
          </p>
        </span>
      { /if }

      <h2>Game proper</h2>
      { #if gameMode === 'arcade' }
        <p>
          Once the game starts, the timer will start counting down from <b>30 seconds</b>.
          For every target successfully reached, the timer will be increased by <b>5 seconds</b> (easy), <b>7.5 seconds</b> (medium), or <b>10 seconds</b> (hard).
        </p>
        <p>
          Numbers used in your solution will be returned to their respective bins and replaced with newly picked numbers.
          A new target will also be generated.
        </p>
        <p>
          Additionally, if you&CloseCurlyQuote;re having a hard time with a target, a <b>skip</b> button is available that will change it.
          Note that you may only skip a target every <b>5 seconds</b>.
        </p>
      { :else }
        <p>
          Once you have your target, you have <b>30 seconds</b> to reach it using the six random numbers that you have.
        </p>
      { /if }
      <p>
        You may only use the four basic mathematical operations (addition, subtraction, multiplication, and division), and you may only use the numbers as many times as you have them.
        You are also prohibited from making any value that is less than 1 or not a whole number.
      </p>
      <p>
        Apart from this, the game will also keep you from performing some repetitive calculations, such as multiplying and dividing by 1 or subtracting a number by half of itself.
      </p>
      { #if gameMode === 'daily' }
        { @render dailyNote() }
      { /if }

      <h2>Solutions</h2>
      <p>
        Once your time is up, the game will allow you to look through the solutions that it has computed, as well as how many of them there are.
      </p>
      { #if gameMode !== 'arcade' }
        <p>
          Because the numbers you get are completely random, some targets are impossible to reach exactly with some sets of numbers.
          If the game can&CloseCurlyQuote;t find an exact solution, don&CloseCurlyQuote;t worry: there really isn&CloseCurlyQuote;t one!
        </p>
      { /if }
      <p>
        Note that solutions are computed by the game on your device without calling any other external websites.
        This allows the game to work even without an internet connection.
      </p>
      <p>
        Unfortunately, this means that slower devices may take a while to find all possible solutions to some games.
        The solver has been optimized to find solutions as quickly (but still as completely) as possible; however, the nature of the solution-finding process may make the algorithm run slowly on less performant devices.
      </p>
    { :else if gameType === 'letters' }
      { #if gameMode === 'classic' }
        <p>
          Welcome to <b>Countle: Letters</b>, where your goal is to form the longest word you can using nine randomly selected letters.
          Although you get to choose whether to reveal a consonant or a vowel, the letters you <i>actually</i> get are completely random, so good luck!
        </p>
      { :else if gameMode === 'daily' }
        <p>
          Welcome to <b>Countle: Daily Letters</b>, where your goal is to form the longest word you can using nine randomly selected letters.
          Everyone in the world will get the same nine letters everyday, but you won&CloseCurlyQuote;t know what they are until you actually start the game, so good luck!
        </p>
      { :else if gameMode === 'arcade' }
        <p>
          Welcome to <b>Countle: Arcade Letters</b>, where your goal is to complete as many Letters rounds as possible before time runs out.
          When you successfully solve a round, a new one comes out immediately, so solve them as fast as you can!
        </p>
      { /if }

      <h2>Letter selection</h2>
      { #if gameMode === 'classic' }
        <p>
          At the beginning of every round, you get to choose nine letters from two bins: <b>consonants</b> and <b>vowels</b>.
          You get to choose how many of each you want; but you may only have at most five vowels or at most six consonants.
        </p>
      { :else if gameMode === 'daily' }
        <p>
          Unlike a regular Letters game, every player gets the same letters for the daily Letters games, just like how everyone in the world gets the same <i>Wordle</i> puzzle everyday.
          All you have to do is push a button to reveal them!
        </p>
      { :else if gameMode === 'arcade' }
        <p>
          Unlike a regular Letters game, the letters are randomly chosen across the vowel and consonant bins.
          <b>Easy</b> games will take letters from these bins, just like in regular Letters games.
        </p>
        <p>
          Additionally, <b>medium</b> games can also give you up to two 2-letter tiles, and <b>hard</b> games can give you up to one 3-letter tile.
        </p>
      { /if }

      <h2>Game proper</h2>
      { #if gameMode === 'arcade' }
        <p>
          Once the game starts, the timer will start counting down from <b>30 seconds</b>.
          For every word submitted, the timer will be increased by <b>1 second</b> for every letter in your word.
        </p>
        <p>
          Letters used in your solution will be returned to their respective bins and replaced with newly picked letters.
        </p>
        <p>
          Additionally, if you&CloseCurlyQuote;re having a hard time with a certain set of letters, a <b>reroll</b> button is available that will replace all of your letters.
          Note that you may only reroll every <b>5 seconds</b>.
        </p>
      { :else }
        <p>
          Once you have your letters, you have <b>30 seconds</b> to form the longest word you can with them.
        </p>
      { /if }
      <p>
        For uniformity, the game checks against the SCOWL and Friends American English word list.
        As such, spellings such as &OpenCurlyDoubleQuote;colour&CloseCurlyDoubleQuote; or &OpenCurlyDoubleQuote;metre&CloseCurlyDoubleQuote; are not accepted.
      </p>
      { #if gameMode === 'daily' }
        { @render dailyNote() }
      { /if }

      <h2>Longest words</h2>
      <p>
        Once your time is up, the game will allow you to look through the longest words it has found, as well as how many of them there are.
      </p>
      <p>
        Because the letters you get are completely random, it is quite rare to have a set of letters that can form a nine-letter word.
        If the game can&CloseCurlyQuote;t find a word with all the letters you have, don&CloseCurlyQuote;t worry: there really isn&CloseCurlyQuote;t one!
      </p>
      <p>
        Note that words are checked by the game on your device without calling any other external websites.
        This allows the game to work even without an internet connection.
      </p>
    { /if }
  </svelte:fragment>
</Dialog>

<button class="icon-btn" onclick={ () => dialog.open() }>
  <Help strokeWidth="0.1rem" size="100%" />
</button>

<style>
  p, h2 {
    margin: 0;
  }

  h2 {
    margin-top: 0.5rem;
  }

  .icon-btn {
    align-self: center;
  }

  .note {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.6rem;
  }

  .note-red {
    border: var(--border-width) solid var(--colar-red-8);
    background: var(--colar-red-0);
    color: var(--colar-red-10);
  }

  .note-yellow {
    border: var(--border-width) solid var(--colar-yellow-8);
    background: var(--colar-yellow-0);
    color: var(--colar-yellow-10);
  }

  .note-title {
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .note-yellow .note-title {
    border-bottom: var(--border-width) solid var(--colar-yellow-8);
  }

  .note-red .note-title {
    border-bottom: var(--border-width) solid var(--colar-red-8);
  }

  @media (prefers-color-scheme: dark) {
    .note-red {
      background: var(--colar-red-12);
      color: var(--colar-red-2);
    }

    .note-yellow {
      background: var(--colar-yellow-12);
      color: var(--colar-yellow-2);
    }

    .note-yellow .note-title {
      border-bottom-color: var(--colar-yellow-5);
    }

    .note-red .note-title {
      border-bottom-color: var(--colar-red-5);
    }
  }
</style>
