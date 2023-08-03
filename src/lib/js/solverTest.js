import solve, { stringifySteps } from './solvers.js';

let s = performance.now();
solve.solveNumbers([9, 3, 4, 5, 10, 50], 682).solutions.forEach(x => console.log(stringifySteps(x.steps)));
console.log(performance.now() - s);
