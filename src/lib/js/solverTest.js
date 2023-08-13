import solve from './solvers.js';

let s = performance.now();
solve.solveNumbers([8, 2, 3, 7, 25, 75], 692).solutions.forEach(x => console.log(x.steps));
console.log(performance.now() - s);
