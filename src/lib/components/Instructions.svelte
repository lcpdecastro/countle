<script>
    import IconHelp from 'phosphor-svelte/lib/Question';

    import { page } from '$app/stores';
    
    import Modal from '$lib/components/Modal.svelte';

    let open = false;
</script>

<button on:click={ () => open = true }>
    <IconHelp size="100%" />
</button>

<Modal bind:open>
    <svelte:fragment slot="title">Instructions</svelte:fragment>

    <div class="modal-body" slot="body">
        { #if $page.url.pathname.endsWith('letters') }
            <p>
                Welcome to <b>Countle: { $page.url.pathname.includes('daily') ? 'Daily ' : '' }Letters</b>, where your goal is to create the longest possible word you can using nine randomly selected letters.
                { #if !$page.url.pathname.includes('daily') }
                    Although you get to choose whether to reveal a consonant or a vowel, what letter <i>actually</i> comes out is completely random!
                { /if }
            </p>

            <h2>Letter selection</h2>
            { #if $page.url.pathname.includes('daily') }
                <p>
                    Unlike Infinite Letters, Daily Letters presents you with a predetermined set of nine letters that everyone will also get. Think <i>Wordle</i>, but for Countdown Letters.
                </p>
                <p>
                    Once you press the <i>Show Today&CloseCurlyQuote;s Letters</i> button, the timer starts immediately!
                    Also, you only get to play the day&CloseCurlyQuote;s Daily Letters <b>once</b>&mdash;make it count!
                </p>
            { :else }
                <p>
                    Like the original <i>Countdown</i>, you only get to choose whether to reveal a consonant or a vowel.
                    The letter selection pools are randomly arranged, so you won&CloseCurlyQuote;t know what letter you&CloseCurlyQuote;ll be getting until you choose it.
                </p>
                <p>
                    Of course, to make sure that a word can actually be made out of the letters on the board, a maximum of <b>five vowels</b> or <b>six consonants</b> are required.
                    The game will disable the appropriate selection button should one of these limits be reached.
                </p>
            { /if }

            <h2>Game proper</h2>
            { #if !$page.url.pathname.includes('daily') }
                <p>
                    Once you&CloseCurlyQuote;ve revealed your ninth letter, the timer starts immediately&mdash;you only have <b>30 seconds</b> to make the longest word you can!
                </p>
            { /if }
            <p>
                Although the letters are arranged on-screen as a 3&times;3 grid, the letters do not necessarily have to connect.
                Anything goes as long as the word is valid and you only use each letter at most as many times as you have copies of it on the board.
                For example, you&CloseCurlyQuote;re welcome to use two T&CloseCurlyQuote;s, as long as you have at least two T&CloseCurlyQuote;s.
            </p>
            <p>
                Letters can be selected either by clicking on them or by using the keyboard.
                The <b>Backspace</b> key deletes by letter, while the <b>Delete</b> key removes the entire word.
            </p>
            <p>
                Because of the randomized nature of the letter selection process, it is highly likely that the letters on the board cannot form a nine-letter word.
                If the solver can&CloseCurlyQuote;t find a nine-letter word, don&CloseCurlyQuote;t worry: there really isn&CloseCurlyQuote;t one!
            </p>
        { :else if $page.url.pathname.endsWith('numbers') }
            <p>
                Welcome to <b>Countle: { $page.url.pathname.includes('daily') ? 'Daily ' : '' }Numbers</b>, where your goal is to reach a random target number using six randomly selected numbers.
                { #if !$page.url.pathname.includes('daily') }
                    Although you get to choose whether to reveal a small or a large number, what number <i>actually</i> comes out is completely random!
                { /if }
            </p>

            <h2>Number selection</h2>
            { #if $page.url.pathname.includes('daily') }
                <p>
                    Unlike Infinite Numbers, Daily Numbers presents you with a predetermined set of six numbers and a target that everyone will also get. Think <i>Wordle</i>, but for Countdown Numbers.
                </p>
                <p>
                    Once you press the <i>Show Today&CloseCurlyQuote;s Numbers</i> button, the timer starts immediately!
                    Also, you only get to play the day&CloseCurlyQuote;s Daily Numbers <b>once</b>&mdash;make it count!
                </p>
            { :else }
                <p>
                    Like the original <i>Countdown</i>, you only get to choose whether to reveal a small or a large number.
                    The number selection pools are randomly arranged, so you won&CloseCurlyQuote;t know what number you&CloseCurlyQuote;ll be getting until you choose it.
                </p>
                <p>
                    The small number pool contains two copies each of the numbers 1 to 10, while the large number pool contains 25, 50, 75, and 100.
                    As such, you can only have at most four large numbers. However, you may choose not to reveal any large numbers and just work with six small numbers.
                    Since the small number pool contains duplicates, it&CloseCurlyQuote;s possible for the random number selection to have duplicates as well.
                </p>
                <p>
                    Once the six numbers have been selected, you will then be asked to generate a random three-digit target number.
                    This target number ranges from 101 to 999 (inclusive), which you will need to get as close as possible to using the four basic mathematical operations and the six random numbers.
                </p>
            { /if }

            <h2>Game proper</h2>
            { #if !$page.url.pathname.includes('daily') }
                <p>
                    Once you&CloseCurlyQuote;ve revealed your target number, the timer starts immediately&mdash;you only have <b>30 seconds</b> to get as close to it as you can.
                </p>
            { /if }
            <p>
                The board is divided into two parts: the left part will contain your six random numbers, while the right part will contain the intermediate steps you&CloseCurlyQuote;ll be performing to try to reach the target.
            </p>
            <p>
                You are free to use the numbers and the intermediate results of each step as you see fit, however, you may <b>not</b>, at any point, generate a non-positive (i.e., 0 and below) or non-integer (i.e., any number with a fractional part such as 2.5) number as your intermediate result.
                You may also only use the numbers you have as many times as you have copies of them on the board.
                For example, you&CloseCurlyQuote;re welcome to use two 2&CloseCurlyQuote;s, as long as you have two 2&CloseCurlyQuote;s (in your random six and/or in your intermediate results).
            </p>
            <p>
                Also, just because there&OpenCurlyQuote;s six numbers doesn&OpenCurlyQuote;t mean you have to use them all.
                As long as you can reach the target and you follow the rules above, your solution will be considered valid.
            </p>
            <p>
                There is no &OpenCurlyDoubleQuote;submit&CloseCurlyDoubleQuote; button in this game; just keep your solution on screen until the timer runs out.
                Should you be able to reach the target, your solution will be locked in and will no longer be editable.
            </p>
            <p>
                Remember: the game <b>does not</b> automatically add your intermediate results to reach the target.
                For example, if the target is 200 and your two steps result in 150 and 50, the game will <b>not</b> consider your solution to be complete unless you explicitly add them together in a third step.
            </p>
            <p>
                Because of the randomized nature of the number selection process, it is possible for the six random numbers to be unable to reach the target exactly.
                This is especially the case for all-small numbers and a very big target, four larges and two smalls, or selections with two 1&CloseCurlyQuote;s.
                If the solver can&CloseCurlyQuote;t find an exact solution, don&CloseCurlyQuote;t worry: there really isn&CloseCurlyQuote;t one!
            </p>

            <h2>Default input</h2>
            <p>
                To select a number, click on it to use it in an intermediate step.
                You may also immediately chain the result of a step to another step by selecting an operator immediately after receiving it.
                Clicking on a number that is already being used in your solution will deselect it, returning it to where it came from and removing <i>all</i> steps after it.
                Be careful where you click!
            </p>
            <p>
                To select an operator, click on its respective button.
                To remove an operator, click on it in the intermediate step.
                Like with the numbers, removing an operator removes <i>all</i> steps after it.
            </p>
            <p>
                The operator buttons will automatically be grayed out if the operation would create an illegal result (e.g., trying to divide 5 by 2).
                It will also be grayed out for operations that would be repetitive (e.g., subtracting 8 by 4; you might as well just use the 4 on its own).
                Likewise, if you&CloseCurlyQuote;ve selected your first operand and your operator, any numbers that would result in an illegal or repetitive operation will become unselectable.
            </p>
            <p>
                By default, operators are selected from a separate selection panel at the bottom of the steps area.
                Through the settings, you may enable an alternative operator selection method, which brings the operator buttons to each step instead of on a separate panel.
                This method, however, may be difficult to work with, since the selection buttons will be much smaller.
                Chaining intermediate results would also be impossible unless you use a keyboard.
            </p>

            <h2>Keyboard input</h2>
            <p>
                Alternatively, the keyboard may also be used to select numbers and operators.
                However, due to the difficulty of implementing a keyboard-based input system for the Numbers game, keyboard input is disabled by default.
                This can be enabled through the settings, located to the left of the timer.
            </p>
            <p>
                By enabling keyboard input for Numbers games, a letter will appear on the upper-left corner of each selectable square corresponding to the keyboard key that selects it.
                These keys are <b>Q W E R T Y</b> for the random six and <b>A S D F</b> for the first four intermediate results (the fifth intermediate result doesn&CloseCurlyQuote;t have a keyboard shortcut because it wouldn&CloseCurlyQuote;t be selectable anyway, since there wouldn&CloseCurlyQuote;t be any numbers left to operate on it with).
            </p>
            <p>
                The addition, subtraction, multiplication, and division operators are assigned to the <b>+ - * /</b> keys, respectively. <b>X</b> may also be used for multiplication.
                The <b>Backspace</b> key removes numbers and operators one by one, while the <b>Delete</b> key removes entire steps.
                <b>Shift + Delete</b> will clear your entire solution.
            </p>
        { /if }
    </div>
</Modal>

<style>
    button {
        padding: initial;
        margin-left: auto;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.5rem;
        outline-offset: 0.25rem;
    }

    button:focus {
        outline: 1px solid currentColor;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        line-height: 1.25;
    }

    .modal-body > p ~ h2 {
        margin: 1rem 0 0 0;
    }

    .modal-body > p {
        margin: 0;
        line-height: 1.5;
    }
</style>
