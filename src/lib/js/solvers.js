import dictionary from './dictionary.js';

function isFlattenable (arr, op) {
    const inv = { '+': '-', '-': '+', '*': '/', '/': '*' };
    return arr.length > 1 && arr.filter(x => typeof x === 'string').every(x => x === op || x === inv[op]);
}

function sortOperands (a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        const d = a.length - b.length;
        if (d !== 0) return d;

        for (let i = 0; i < a.length; i += 2) {
            const e = sortOperands(a[i], b[i]);
            if (e !== 0) return e;
        }
    }
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    if (typeof a === 'number') return -1;
    if (typeof b === 'number') return 1;

    return 0;
}

function* numbersHelper (numbers) {
    if (numbers.length === 1) return;
    
    for (let i = 0; i < numbers.length; i++) {
        yield numbers.filter((x, n) => n !== i).concat(numbers[i]);
    }
    
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (i === j) continue;
            
            const [a, b] = [numbers[i].value, numbers[j].value];
            const removed = numbers.filter((x, n) => ![i, j].includes(n));

            const [as, bs] = [numbers[i].steps, numbers[j].steps];
            
            if (i < j) {
                const [fas, fbs] = [isFlattenable(as, '+') ? as : [as], isFlattenable(bs, '+') ? bs : [bs]];
                
                const steps = [...(['+', ...fas].reduce((p, c, i, a) => (i % 2) ? p : p.concat([[c, a[i + 1]]]), [])), ...(['+', ...fbs].reduce((p, c, i, a) => (i % 2) ? p : p.concat([[c, a[i + 1]]]), []))];
                steps.sort((a, b) => {
                    if (a[0] === b[0]) return sortOperands(a[1], b[1]);
                    else if (a[0] === '-') return 1;
                    else if (b[0] === '-') return -1;
                });

                const r = removed.concat({ value: a + b, steps: steps.flat(1).slice(1) });
                yield r;
                yield* numbersHelper(r);
            }
            if (a > b) {
                const fas = isFlattenable(as, '-') ? as : [as];
                
                const steps = [...(['+', ...fas].reduce((p, c, i, a) => (i % 2) ? p : p.concat([[c, a[i + 1]]]), [])), ['-', bs]];
                steps.sort((a, b) => {
                    if (a[0] === b[0]) return sortOperands(a[1], b[1]);
                    else if (a[0] === '-') return 1;
                    else if (b[0] === '-') return -1;
                });

                const r = removed.concat({ value: a - b, steps: steps.flat(1).slice(1) });
                yield r;
                yield* numbersHelper(r);
            }
            if (i < j) {
                const [fas, fbs] = [isFlattenable(as, '*') ? as : [as], isFlattenable(bs, '*') ? bs : [bs]];
                
                const steps = [...(['*', ...fas].reduce((p, c, i, a) => (i % 2) ? p : p.concat([[c, a[i + 1]]]), [])), ...(['*', ...fbs].reduce((p, c, i, a) => (i % 2) ? p : p.concat([[c, a[i + 1]]]), []))];
                steps.sort((a, b) => {
                    if (a[0] === b[0]) return sortOperands(a[1], b[1]);
                    else if (a[0] === '/') return 1;
                    else if (b[0] === '/') return -1;
                });

                const r = removed.concat({ value: a * b, steps: steps.flat(1).slice(1) });
                yield r;
                yield* numbersHelper(r);
            }
            if (!(a % b)) {
                const fas = isFlattenable(as, '/') ? as : [as];
                
                const steps = [...(['*', ...fas].reduce((p, c, i, a) => (i % 2) ? p : p.concat([[c, a[i + 1]]]), [])), ['/', bs]];
                steps.sort((a, b) => {
                    if (a[0] === b[0]) return sortOperands(a[1], b[1]);
                    else if (a[0] === '/') return 1;
                    else if (b[0] === '/') return -1;
                });

                const r = removed.concat({ value: a / b, steps: steps.flat(1).slice(1) });
                yield r;
                yield* numbersHelper(r);
            }
        }
    }
}

function solveNumbers (numbers, target) {
    const gen = numbersHelper(numbers.map(x => { return { value: x, steps: [x] }; }));

    const memo = new Set();
    const skip = new Set();
    
    const solutions = [];
    let diff = Infinity;
    
    while (true) {
        const n = gen.next();
        if (n.done) break;
        
        const v = n.value;
        const vl = v.at(-1);
        const svl = stringifySteps(vl.steps);

        if (vl.steps.length > 1 && vl.steps.flat(Infinity).includes(vl.value)) {
            skip.add(svl);
            continue;
        }

        if (memo.has(svl)) continue;
        memo.add(svl);

        const d = Math.abs(v.at(-1).value - target);
        if (d <= diff) {
            if (d < diff) {
                solutions.length = 0;
                diff = d;
            }

            solutions.push(vl);
        }
    }

    const skipArr = Array.from(skip.values());
    
    return { diff, solutions: solutions.filter(x => { const sx = stringifySteps(x.steps); return skipArr.every(y => !sx.includes(y)) }) };
}

export function stringifySteps (steps, top = true) {
    if (steps.length === 1) return `${steps[0]}`;
    const out = `(${steps.map(x => typeof x === 'string' ? x : stringifySteps(x, false)).join(' ')})`;
    if (top) return out.slice(1, -1); else return out;
}

function* lettersHelper (letters, max, curr = "") {
    if (curr.length === max) {
        yield curr;
        return;
    }

    for (let i = 0; i < letters.length; i++) yield* lettersHelper(letters.slice(0, i).concat(letters.slice(i + 1)), max, curr + letters[i]);
}

function solveLetters (letters) {
    let out = { longest: null, words: [] };

    for (let i = 9; i > 2; i--) {
        let perms = lettersHelper(letters, i);

        while (true) {
            let n = perms.next();
            if (n.done) break;

            if (dictionary.has(n.value.toLowerCase()) && !out.words.includes(n.value)) out.words.push(n.value);
        }

        if (out.words.length) {
            out.longest = i;
            break;
        }
    }

    return out;
}

const solve = { solveLetters, solveNumbers };

export default solve;
