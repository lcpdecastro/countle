<script>
  import Help from 'lucide-svelte/icons/help-circle';
  import Alert from 'lucide-svelte/icons/alert-triangle';

  import Dialog from './Dialog.svelte';

  import { page } from '$app/stores';

  let dialog = $state();
</script>

{ #snippet dailyNote() }
  <span class="daily-note">
    <p class="alert-title">
      <Alert size="1rem" />
      <b>IMPORTANT NOTE</b>
    </p>
    <p>
      If you abandon a Daily game by reloading or visiting a different page while the timer is running, your game will be <b>forfeited</b> in its current state!
    </p>
  </span>
{ /snippet }

<Dialog bind:this={ dialog }>
  <svelte:fragment slot="title">
    Instructions
  </svelte:fragment>

  <svelte:fragment slot="body">
    { #if $page.url.pathname.includes('numbers') }
      { #if $page.url.pathname.includes('daily') }
        <p>
          Welcome to <b>Countle: Daily Numbers</b>, where your goal is to get as close as possible to a target three-digit number using six randomly selected numbers.
          Everyone in the world will get the same numbers and target everyday, but you won&CloseCurlyQuote;t know what they are until you actually start the game, so good luck!
        </p>
      { :else }
        <p>
          Welcome to <b>Countle: Numbers</b>, where your goal is to get as close as possible to a target three-digit number using six randomly selected numbers.
          Although you get to choose whether to reveal a small or large number, the numbers you <i>actually</i> get are completely random, so good luck!
        </p>
      { /if }

      <h2>Number selection</h2>
      { #if $page.url.pathname.includes('daily') }
        <p>
          Unlike a regular Numbers game, every player gets the same numbers and target for the daily Numbers games, just like how everyone in the world gets the same <i>Wordle</i> puzzle everyday.
          All you have to do is push a button to reveal them!
        </p>
      { :else }
        <p>
          At the beginning of every round, you get to choose six numbers from two bins: <b>large numbers</b>, containing 25, 50, 75, and 100; and <b>small numbers</b>, containing two each of the numbers from 1 to 10.
          You get to choose how many of each you want&mdash;you can even choose to have four large numbers, or none at all!
        </p>
        <p>
          After choosing your six numbers, you then generate a random three-digit number from 101 to 999.
        </p>
      { /if }

      <h2>Game proper</h2>
      <p>
        Once you have your target number, you have <b>30 seconds</b> to reach it using the six random numbers that you have.
      </p>
      <p>
        You may only use the four basic mathematical operations (addition, subtraction, multiplication, and division), and you may only use the numbers as many times as you have them.
        You are also prohibited from making any value that is less than 1 or not a whole number.
      </p>
      <p>
        Apart from this, the game will also keep you from performing some repetitive calculations, such as multiplying and dividing by 1 or subtracting a number by half of itself.
      </p>
      { #if $page.url.pathname.includes('daily') }
        { @render dailyNote() }
      { /if }

      <h2>Solutions</h2>
      <p>
        Once your time is up, the game will allow you to look through the solutions that it has computed, as well as how many of them there are.
      </p>
      <p>
        Because the numbers you get are completely random, some targets are impossible to reach exactly with some sets of numbers.
        If the game can&CloseCurlyQuote;t find an exact solution, don&CloseCurlyQuote;t worry: there really isn&CloseCurlyQuote;t one!
      </p>
      <p>
        Note that solutions are computed by the game on your device without calling any other external websites.
        This allows the game to work even without an internet connection.
      </p>
      <p>
        Unfortunately, this means that slower devices may take a while to find all possible solutions to some games.
        The solution finder has been optimized to find solutions as quickly (but still as accurately) as possible; however, the nature of the solution-finding process may make the algorithm run slowly on less performant devices.
      </p>
    { :else if $page.url.pathname.includes('letters') }
      { #if $page.url.pathname.includes('daily') }
        <p>
          Welcome to <b>Countle: Daily Letters</b>, where your goal is to form the longest word you can using nine randomly selected letters.
          Everyone in the world will get the same nine letters everyday, but you won&CloseCurlyQuote;t know what they are until you actually start the game, so good luck!
        </p>
      { :else }
        <p>
          Welcome to <b>Countle: Letters</b>, where your goal is to form the longest word you can using nine randomly selected letters.
          Although you get to choose whether to reveal a consonant or a vowel, the letters you <i>actually</i> get are completely random, so good luck!
        </p>
      { /if }

      <h2>Letter selection</h2>
      { #if $page.url.pathname.includes('daily') }
        <p>
          Unlike a regular Letters game, every player gets the same letters for the daily Letters games, just like how everyone in the world gets the same <i>Wordle</i> puzzle everyday.
          All you have to do is push a button to reveal them!
        </p>
      { :else }
        <p>
          At the beginning of every round, you get to choose nine letters from two bins: <b>consonants</b> and <b>vowels</b>.
          You get to choose how many of each you want; but you may only have at most five vowels or at most six consonants.
        </p>
      { /if }

      <h2>Game proper</h2>
      <p>
        Once you have your nine letters, you have <b>30 seconds</b> to form the longest word you can with them.
      </p>
      <p>
        You may only use the letters as many times as you have them.
        For uniformity, the game checks against the SCOWL and Friends American English word list; as such, spellings such as &OpenCurlyDoubleQuote;colour&CloseCurlyDoubleQuote; or &OpenCurlyDoubleQuote;metre&CloseCurlyDoubleQuote; are not accepted.
      </p>
      { #if $page.url.pathname.includes('daily') }
        { @render dailyNote() }
      { /if }

      <h2>Longest words</h2>
      <p>
        Once your time is up, the game will allow you to look through the longest words it has found, as well as how many of them there are.
      </p>
      <p>
        Because the letters you get are completely random, it is quite rare to have a set of letters that can form a nine-letter word.
        If the game can&CloseCurlyQuote;t find a nine-letter word with the letters you have, don&CloseCurlyQuote;t worry: there really isn&CloseCurlyQuote;t one!
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

  .daily-note {
    padding: 0.4rem 0.6rem;
    border: 0.075rem solid var(--colar-red-8);
    border-radius: 0.6rem;
    background: var(--colar-red-0);
    color: var(--colar-red-8);
  }

  .alert-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
