import dayjs from 'dayjs';
import { writable } from 'svelte/store';

function dailyStore () {
  const { subscribe, set } = writable(null, () => {
    const value = JSON.parse(localStorage.getItem('daily'));

    if (value && value.date === dayjs().format('YYYY-MM-DD')) set(JSON.parse(localStorage.getItem('daily')) ?? { 'date': dayjs().format('YYYY-MM-DD') });
    else set({ 'date': dayjs().format('YYYY-MM-DD') });
  });

  return {
    subscribe,
    set (x) {
      set(x);
      localStorage.setItem('daily', JSON.stringify(x));
    }
  };
}

const daily = dailyStore();

export default daily;
