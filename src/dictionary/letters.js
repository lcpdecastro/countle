import dictionary from '../lib/js/en_US.js';

const size = dictionary.size;

const vowels = new Map();
const consonants = new Map();
const doubles = new Map();
const triples = new Map();

for (let word of dictionary) {
  for (let x of new Set(word.split(''))) {
    if ('aeiou'.includes(x)) vowels.set(x, (vowels.get(x) ?? 0) + (1 / size));
    else consonants.set(x, (consonants.get(x) ?? 0) + (1 / size));
  }

  for (let x of word.split('').reduce((p, c, i, a) => {
    if (i < a.length - 1) p.add(a[i] + a[i + 1]);
    return p;
  }, new Set())) {
    doubles.set(x, (doubles.get(x) ?? 0) + (1 / size));
  }

  for (let x of word.split('').reduce((p, c, i, a) => {
    if (i < a.length - 2) p.add(a[i] + a[i + 1] + a[i + 2]);
    return p;
  }, new Set())) {
    triples.set(x, (triples.get(x) ?? 0) + (1 / size));
  }
}

function toFreqArray (set, count = undefined, adjust = 10) {
  const g = Array.from(set.entries()).sort((a, b) => b[1] - a[1]).slice(0, count);
  return g.map(x => Array(Math.ceil(x[1] * adjust)).fill(x[0].toUpperCase())).reduce((p, c) => p.concat(c), []);
}

// console.log(toFreqArray(vowels, undefined, 20));
// console.log(toFreqArray(consonants));
console.log(toFreqArray(doubles, 50));
// console.log(toFreqArray(triples, 30));
