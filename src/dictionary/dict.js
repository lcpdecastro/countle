import fs from 'node:fs/promises';

await fs.writeFile('en_US.js',
`const dictionary = new Set();

`
);

let wordlist = await fs.open('en_US.txt');

for await (let word of wordlist.readLines()) {
  if (word.length >= 3 && word.split('').every(x => x.match(/[a-z]/g))) {
    await fs.appendFile('en_US.js', `dictionary.add('${word}');\n`);
  }
}

await fs.appendFile('en_US.js',
`
export default dictionary;`
);
