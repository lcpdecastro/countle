import { get, writable } from "svelte/store";
import { browser } from "$app/environment";
import dayjs from "dayjs";

function dailyInit () {
    return {
        'date': dayjs().format('YYYYMMDD'),
        'letters': null,
        'numbers': null
    }
}

const daily = writable(browser ? JSON.parse(localStorage.getItem('daily')) : dailyInit());

daily.subscribe(value => {
    if (browser) {
        if (value?.date !== dayjs().format('YYYYMMDD')) {
            const v = dailyInit();
            daily.set(v);
            localStorage.setItem('daily', JSON.stringify(v));
        } else localStorage.setItem('daily', JSON.stringify(value));
    }
});

export function logDaily (x) {
    const d = get(daily);

    if (d.date === dayjs().format('YYYYMMDD')) {
        if ('letters' in x) d.letters ??= x.letters;
        else if ('numbers' in x) d.numbers ??= x.numbers;
        daily.set(d);
    } else daily.set(dailyInit());
}

export function getDaily (game) {
    return get(daily)[game];
}
