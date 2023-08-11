class N {
    constructor (value, steps = undefined) {
        this.value = value;
        this.steps = steps ?? [this];
    }

    normalize () {
        if (this.steps.length === 1) return new N(this.value);

        const [a, o, b] = this.steps;

        const fa = a.steps.filter(x => typeof x === 'string').every(x => ('+-'.includes(o) ? '+-' : '*/').includes(x)) ? a.normalize().steps : [a.normalize()];
        const fb = ('+*'.includes(o) && b.steps.filter(x => typeof x === 'string').every(x => (o === '+' ? '+-' : '*/').includes(x))) ? b.normalize().steps : [b.normalize()];

        const s = [('+-'.includes(o) ? '+' : '*'), ...fa, o, ...fb].reduce((p, c, i, a) => i % 2 ? p : p.concat([[c, a[i + 1]]]), []);
        s.sort((a, b) => {
            if (a[0] === b[0]) {
                if (a[1].steps.length !== b[1].steps.length) return a[1].steps.length - b[1].steps.length;
                return a[1].value - b[1].value;
            }
            if (a[0] === ('+-'.includes(o) ? '-' : '/')) return 1;
            if (b[0] === ('+-'.includes(o) ? '-' : '/')) return -1;
        });

        return new N(this.value, s.reduce((p, c) => p.concat(...c), []).slice(1));
    }

    expand () {
        return this.steps.map(x => x instanceof N ? (x.steps.length === 1 ? x : x.expand()) : x);
    }

    eq (x) {
        if (this.value !== x.value) return false;
        
        if (this.steps.length === 1 && x.steps.length === 1) return true;
        if (this.steps.length !== x.steps.length) return false;

        for (let i = 0; i < this.steps.length; i++) {
            const a = this.steps[i];
            const b = x.steps[i];

            if (typeof a !== typeof b) return false;
            if (a instanceof N && !a.eq(b)) return false;
            if (typeof a === 'string' && a !== b) return false;
        }

        return true;
    }

    stringifySteps (p = false) {
        if (this.steps.length === 1) return this.value;
        return `${p ? '(' : ''}${this.steps.map(x => x instanceof N ? x.stringifySteps(true) : x).join(' ')}${p ? ')' : ''}`;
    }

    toObject () {
        return {
            value: this.value,
            steps: this.stringifySteps()
        }
    }

    isRoundabout (v = []) {
        if (this.steps.length === 1) return false;
        
        const s = this.steps.filter(x => x instanceof N);
        const nv = v.concat(this.value);

        if (s.some(x => nv.includes(x.value))) return true;
        return s.some(x => x.isRoundabout(nv));
    }
}

function* numbersHelper (numbers) {
    if (numbers.length === 1) return;

    for (let i = 0; i < numbers.length; i++){
        for (let j = 0; j < numbers.length; j++) {
            if (i === j) continue;

            const a = numbers[i];
            const b = numbers[j];
            const filtered = numbers.filter((_, n) => n !== i && n !== j);

            if (i < j) {
                const r = filtered.concat(new N(a.value + b.value, [a, '+', b]));
                yield r;
                yield* numbersHelper(r);
            }
            if (a.value > b.value && a.value !== b.value * 2) {
                const r = filtered.concat(new N(a.value - b.value, [a, '-', b]));
                yield r;
                yield* numbersHelper(r);
            }
            if (i < j && a.value !== 1 && b.value !== 1) {
                const r = filtered.concat(new N(a.value * b.value, [a, '*', b]));
                yield r;
                yield* numbersHelper(r);
            }
            if (!(a.value % b.value) && b.value !== 1 && a.value !== b.value ** 2) {
                const r = filtered.concat(new N(a.value / b.value, [a, '/', b]));
                yield r;
                yield* numbersHelper(r);
            }
        }
    }
}

export default function solveNumbers (numbers, target) {
    const g = numbersHelper(numbers.map(x => new N(x)));
    
    const solutions = [];
    const roundabouts = [];

    let diff = Infinity;
    
    while (true) {
        const n = g.next();
        if (n.done) break;
    
        const v = n.value.at(-1);
        const vn = v.normalize();

        if (v.isRoundabout() && !roundabouts.find(x => x.eq(vn))) roundabouts.push(vn);

        const d = Math.abs(v.value - target);
        if (d <= diff) {
            if (d < diff) {
                solutions.length = 0;
                diff = d;
            }

            if (!solutions.find(x => x.eq(vn))) solutions.push(vn);
        }
    }
    
    return {
        diff,
        solutions: solutions.filter(x => !roundabouts.find(y => y.eq(x))).map(x => x.toObject())
    }
}
