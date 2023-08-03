import solve from './solvers.js';

addEventListener('message', e => {
    const d = e.data;

    if ('numbers' in d) {
        postMessage(solve.solveNumbers(d.numbers, d.target));
    } else {
        postMessage(solve.solveLetters(d.letters));
    }
});
