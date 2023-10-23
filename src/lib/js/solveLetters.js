import dictionary from "./dictionary.js";

function* helper (letters, max, curr = "") {
    if (curr.length === max) {
        yield curr;
        return;
    }

    for (let i = 0; i < letters.length; i++) yield* helper(letters.slice(0, i).concat(letters.slice(i + 1)), max, curr + letters[i]);
}

function solve (letters) {
    let out = { longest: null, words: [] };

    for (let i = 9; i > 2; i--) {
        let perms = helper(letters, i);

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

    out.words.sort();

    return out;
}

export default solve;
