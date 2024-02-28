class N {
  constructor (value, steps = []) {
    this.value = value;
    this.steps = steps;
  }

  static sort (a, b) {
    if (a.steps.length > 0 && b.steps.length > 0) {
      if (a.steps.length === b.steps.length) {
        for (let i = 0; i < a.steps.length; i++) {
          if (i % 2 === 0) {
            const s = N.sort(a.steps[i], b.steps[i]);
            if (s !== 0) return s;
          } else {
            const s = '+-*/'.indexOf(a.steps[i]) - '+-*/'.indexOf(b.steps[i]);
            if (s !== 0) return s;
          }
        }
      }
      return a.steps.length - b.steps.length;
    }
    if (a.steps.length > 0) return 1;
    if (b.steps.length > 0) return -1;
    return a.value - b.value;
  }

  static combine (a, b, o) {
    const inv = { '+': '-', '-': '+', '*': '/', '/': '*' };

    let value;

    if (o === '+') value = a.value + b.value;
    if (o === '-') {
      if (a.value <= b.value) return;
      if (a.value === b.value * 2) return;
      value = a.value - b.value;
    }
    if (o === '*') {
      if (a.value === 1) return;
      if (b.value === 1) return;
      value = a.value * b.value;
    }
    if (o === '/') {
      if (b.value === 1) return;
      if (a.value % b.value !== 0) return;
      if (a.value === b.value ** 2) return;
      value = a.value / b.value;
    }

    const op1 = [];
    const op2 = [];

    if ([o, inv[o]].includes(a.steps.find(x => typeof x === 'string'))) {
      for (let i = 0; i < a.steps.length; i += 2) {
        if (i === 0) op1.push(a.steps[i]);
        else {
          if ('+*'.includes(a.steps[i - 1])) op1.push(a.steps[i]);
          else op2.push(a.steps[i]);
        }
      }
    } else op1.push(a);

    if ([o, inv[o]].includes(b.steps.find(x => typeof x === 'string'))) {
      for (let i = 0; i < b.steps.length; i += 2) {
        if (i === 0) {
          if ('+*'.includes(o)) op1.push(b.steps[i]);
          else op2.push(b.steps[i]);
        } else {
          if (b.steps[i - 1] === o) op1.push(b.steps[i]);
          else op2.push(b.steps[i]);
        }
      }
    } else {
      if ('+*'.includes(o)) op1.push(b);
      else op2.push(b);
    }

    const steps = [];
    const p = '+*'.includes(o) ? o : inv[o];
    op1.sort(N.sort).forEach(x => { steps.push(p); steps.push(x); });
    op2.sort(N.sort).forEach(x => { steps.push(inv[p]); steps.push(x); });
    steps.shift();

    return new N(value, steps);
  }

  toString (parentheses = false) {
    if (this.steps.length === 0) return `${this.value}`;

    const out = this.steps.map(x => {
      if (x instanceof N) return x.toString(true);
      if (x === '-') return '\u2212';
      if (x === '*') return '\u00d7';
      if (x === '/') return '\u00f7';
      return x;
    }).join(' ');
    if (parentheses) return `(${out})`;
    return out;
  }
}

function* helper (numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const filtered = numbers.filter((_, n) => n !== i && n !== j);

      for (let o of '+-*/') {
        const combined = N.combine(numbers[i], numbers[j], o);

        if (combined) {
          yield combined;
          yield* helper(filtered.concat(combined));
        }
        
        if ('-/'.includes(o)) {
          const combined = N.combine(numbers[j], numbers[i], o);
  
          if (combined) {
            yield combined;
            yield* helper(filtered.concat(combined));
          }
        }
      }
    }
  }
}

export default function solve (numbers, target) {
  const solutions = [];
  const solutionSet = new Set();
  let diff = Infinity;

  for (let s of helper(numbers.map(x => new N(x)))) {
    const string = s.toString();
    if (solutionSet.has(string)) continue;

    const d = Math.abs(s.value - target);
    if (d <= diff) {
      if (d < diff) {
        solutionSet.clear();
        solutions.length = 0;
        diff = d;
      }

      solutions.push({
        value: s.value,
        steps: string
      });
      solutionSet.add(string);
    }
  }

  return { numbers, target, solutions, diff };
}
