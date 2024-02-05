class Number {
    constructor (value, steps = null) {
        this.value = value;
        this.steps = steps ?? [this];
    }

    get stepString () {
        if (this.steps.length === 1) return `${this.value}`;
        return `(${this.steps.map(x => x?.stepString ?? x).join(" ")})`;
    }
}

function sorter (a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
        const s = '+-*/'.indexOf(a) - '+-*/'.indexOf(b);
        if (s) return s;
    }

    if (a.steps.length === 1 && b.steps.length === 1) return a.value - b.value;
    else {
        if (a.steps.length !== b.steps.length) return a.steps.length - b.steps.length;
        else {
            for (let i = 0; i < a.steps.length; i += 2) {
                const s = sorter(a.steps[i], b.steps[i]);
                if (s) return s;
            }
        }
    }

    return 0;
}

function collapse (a, b, op) {
    const check = '+-'.includes(op) ? '+-' : '*/';

    const o = [];
    const p = [];

    if (check.includes(a.steps[1])) {
        o.push(a.steps[0]);

        for (let i = 2; i < a.steps.length; i += 2) {
            if ('+*'.includes(a.steps[i - 1])) o.push(a.steps[i]);
            else p.push(a.steps[i]);
        }
    }
    else o.push(a);

    const inv = '-/'.includes(op);

    if (check.includes(b.steps[1])) {
        if (inv) p.push(b.steps[0]);
        else o.push(b.steps[0]);

        for (let i = 2; i < b.steps.length; i += 2) {
            if ('+*'.includes(b.steps[i - 1])) {
                if (inv) p.push(b.steps[i]);
                else o.push(b.steps[i]);
            }
            else if (inv) o.push(b.steps[i]);
            else p.push(b.steps[i]);
        }
    }
    else if (inv) p.push(b);
    else o.push(b);

    o.sort(sorter);
    p.sort(sorter);

    return { o, p };
}

function* helper (numbers) {
    if (numbers.length === 1) return;

    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (i === j) continue;

            const a = numbers[i];
            const b = numbers[j];
            const r = numbers.filter((_, n) => n !== i && n !== j);

            if (i > j) {
                let { o, p } = collapse(a, b, '+');
                let n = new Number(a.value + b.value, [o[0]].concat(o.slice(1).reduce((x, y) => x.concat(['+', y]), [])).concat(p.reduce((x, y) => x.concat(['-', y]), [])));
                let s = r.concat(n);
                yield s;
                yield* helper(s);
            }
            
            if (a.value > b.value && a.value !== b.value * 2) {
                let { o, p } = collapse(a, b, '-');
                let n = new Number(a.value - b.value, [o[0]].concat(o.slice(1).reduce((x, y) => x.concat(['+', y]), [])).concat(p.reduce((x, y) => x.concat(['-', y]), [])));
                let s = r.concat(n);
                yield s;
                yield* helper(s);
            }
            
            if (i > j && a.value !== 1 && b.value !== 1) {
                let { o, p } = collapse(a, b, '*');
                let n = new Number(a.value * b.value, [o[0]].concat(o.slice(1).reduce((x, y) => x.concat(['*', y]), [])).concat(p.reduce((x, y) => x.concat(['/', y]), [])));
                let s = r.concat(n);
                yield s;
                yield* helper(s);
            }
            
            if (!(a.value % b.value) && b.value !== 1 && a.value !== b.value ** 2) {
                let { o, p } = collapse(a, b, '/');
                let n = new Number(a.value / b.value, [o[0]].concat(o.slice(1).reduce((x, y) => x.concat(['*', y]), [])).concat(p.reduce((x, y) => x.concat(['/', y]), [])));
                let s = r.concat(n);
                yield s;
                yield* helper(s);
            }
        }
    }
}

function solve (numbers, target) {
    const g = helper(numbers.map(x => new Number(x)));
    const memo = new Set();

    let solutions = [];
    let diff = Infinity;

    while (true) {
        const n = g.next();
        if (n.done) break;

        const v = n.value.at(-1);
        const vs = v.stepString.slice(1, -1);

        let d = Math.abs(v.value - target);
        if (d <= diff) {
            if (memo.has(vs)) continue;

            memo.add(vs);

            if (d < diff) {
                solutions = [];
                diff = d;
            }

            solutions.push({
                value: v.value,
                steps: vs.replaceAll('-', '\u2212').replaceAll('*', '\u00d7').replaceAll('/', '\u00f7')
            });
        }
    }

    return { diff, solutions };
}

export default solve;
