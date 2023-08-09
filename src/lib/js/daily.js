import { get, writable } from "svelte/store";
import { browser } from "$app/environment";
import dayjs from "dayjs";

const dailyInit = {
    'date': dayjs().format('YYYYMMDD'),
    'letters': null,
    'numbers': null
};

const daily = writable((() => {
    if (browser) {
        const j = JSON.parse(localStorage.getItem('daily'));
        if (!j) return dailyInit;
        if (j?.date !== dayjs().format('YYYYMMDD')) return dailyInit;
        return j;
    } return dailyInit;
})());

daily.subscribe(value => {
    if (browser) localStorage.setItem('daily', JSON.stringify(value));
});

export function logDaily (x) {
    const d = get(daily);

    if (get(daily).date === dayjs().format('YYYYMMDD')) {
        if ('letters' in x) d.letters ??= x.letters;
        else if ('numbers' in x) d.numbers ??= x.numbers;
        daily.set(d);
    } else daily.set(dailyInit);
}

export function getDaily (game) {
    return get(daily)[game];
}
