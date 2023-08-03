import { writable } from "svelte/store";
import { browser } from "$app/environment";

const settingsInit = {
    'reducedMotion': false,
    'alternateOperations': false,
    'numbersShortcuts': false
};

const settings = writable(browser ? JSON.parse(localStorage.getItem('settings')) ?? settingsInit : settingsInit);

settings.subscribe(value => {
    if (browser) localStorage.setItem('settings', JSON.stringify('global' in value ? settingsInit : value));
});

export default settings;
