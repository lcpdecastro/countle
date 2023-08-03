import { writable } from "svelte/store";
import shuffleList from "shuffle-list";

const gameState = writable(null);

const vowels = writable(shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split('')));
const consonants = writable(shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split('')));

function resetLetters () {
    vowels.set(shuffleList('AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU'.split('')));
    consonants.set(shuffleList('BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ'.split('')));
}

const soloState = writable('l');
const totalScore = writable(0);

export default gameState;
export { vowels, consonants, soloState, totalScore, resetLetters };
