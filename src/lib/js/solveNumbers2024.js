class N {
  constructor (value, steps = []) {
    this.value = value;
    this.steps = steps;
  }

  static sort (a, b) {
    if (a.steps.length > 0 && b.steps.length > 0) {
      if (a.steps.length === b.steps.length) return N.sort(a.steps[0], b.steps[0]);
      return a.steps.length - b.steps.length;
    }
    if (a.steps.length > 0) return 1;
    if (b.steps.length > 0) return -1;
    if (a.steps.length === 0 && b.steps.length === 0) return a.value - b.value;
  }

  static combine (a, b, o) {
    const inv = { '+': '-', '-': '+', '*': '/', '/': '*' };

    const newValue = (
      o === '+' ? a.value + b.value :
      o === '-' ? a.value - b.value :
      o === '*' ? a.value * b.value :
      o === '/' ? a.value / b.value :
      undefined
    );

    const op1 = [];
    const op2 = [];

    if (a.steps.length === 0 || ![o, inv[o]].includes(a.steps.find(x => typeof x === 'string'))) op1.push(a);
    else {
      for (let i = 0; i < a.steps.length; i += 2) {
        const w = a.steps[i - 1];
        const x = a.steps[i];

        if (i === 0) op1.push(x);
        else {
          if (w === '+' || w === '*') op1.push(x);
          else op2.push(x);
        }
      }
    }

    if (b.steps.length === 0 || ![o, inv[o]].includes(b.steps.find(x => typeof x === 'string'))) {
      if (o === '+' || o === '*') op1.push(b);
      else op2.push(b);
    } else {
      for (let i = 0; i < b.steps.length; i += 2) {
        const w = b.steps[i - 1];
        const x = b.steps[i];

        if (i === 0) {
          if (o === '+' || o === '*') op1.push(x);
          else op2.push(x);
        } else {
          if (o === '+' || o === '*') {
            if (w === '+' || w === '*') op1.push(x);
            else op2.push(x);
          } else {
            if (w === '+' || w === '*') op2.push(x);
            else op1.push(x);
          }
        }
      }
    }

    const steps = [];
    for (let x of op1.sort(N.sort)) {
      steps.push((o === '+' || o === '*') ? o : inv[o]);
      steps.push(x);
    }
    for (let x of op2.sort(N.sort)) {
      steps.push((o === '+' || o === '*') ? inv[o] : o);
      steps.push(x);
    }

    return new N(newValue, steps.slice(1));
  }

  toString (parentheses = false) {
    if (this.steps.length === 0) return `${this.value}`;

    let out = this.steps.map(x => {
      if (x instanceof N) return x.toString(true);
      if (x === '-') return '\u2212';
      if (x === '*') return '\u00d7';
      if (x === '/') return '\u00f7';
      return x;
    }).join(' ');
    if (parentheses) return `(${out})`;
    return out;
  }

  get isRepetitive () {
    return this.steps.flat(Infinity).filter(x => x instanceof N).some(x => x.value === this.value);
  }
}

function* helper (numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const a = numbers[i];
      const b = numbers[j];
      const filtered = numbers.filter((_, n) => n !== i && n !== j);

      // a + b
      {
        const toAdd = N.combine(a, b, '+');
        if (!toAdd.isRepetitive) {
          yield toAdd;
          yield* helper(filtered.concat(toAdd));
        }
      }

      // a - b
      if (a.value > b.value && a.value !== b.value * 2) {
        const toAdd = N.combine(a, b, '-');
        if (!toAdd.isRepetitive) {
          yield toAdd;
          yield* helper(filtered.concat(toAdd));
        }
      }

      // b - a
      if (b.value > a.value && b.value !== a.value * 2) {
        const toAdd = N.combine(b, a, '-');
        if (!toAdd.isRepetitive) {
          yield toAdd;
          yield* helper(filtered.concat(toAdd));
        }
      }

      // a * b
      if (a.value !== 1 && b.value !== 1) {
        const toAdd = N.combine(a, b, '*');
        if (!toAdd.isRepetitive) {
          yield toAdd;
          yield* helper(filtered.concat(toAdd));
        }
      }

      // a / b
      if (a.value > b.value && b.value !== 1 && a.value % b.value === 0 && a.value !== b.value * b.value) {
        const toAdd = N.combine(a, b, '/');
        if (!toAdd.isRepetitive) {
          yield toAdd;
          yield* helper(filtered.concat(toAdd));
        }
      }

      // b / a
      if (b.value > a.value && a.value !== 1 && b.value % a.value === 0 && b.value !== a.value * a.value) {
        const toAdd = N.combine(b, a, '/');
        if (!toAdd.isRepetitive) {
          yield toAdd;
          yield* helper(filtered.concat(toAdd));
        }
      }
    }
  }
}

function solve (numbers, target) {
  const solutions = [];
  const solutionSet = new Set();
  let diff = Infinity;

  for (let solution of helper(numbers.map(x => new N(x)))) {
    if (solutionSet.has(solution.toString())) continue;

    const d = Math.abs(solution.value - target);
    if (d <= diff) {
      if (d < diff) {
        solutions.length = 0;
        solutionSet.clear();
        diff = d;
      }

      solutions.push(solution);
      solutionSet.add(solution.toString());
    }
  }

  return { solutions, diff };
}

export default solve;
