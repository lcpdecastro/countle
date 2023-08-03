import { get } from "svelte/store";
import settings from "./settings.js";
import cssEase from "./cssEase.js";

function flip (node, { duration = 300, easing = cssEase } = {}) {
    return {
        duration,
        easing,
        css: (t, u) => `transform: rotateX(${180 * u}deg);`
    };
}

function halfFlip (node, { duration = 150, easing = cssEase } = {}) {
    return {
        duration,
        easing,
        css: (t, u) => `transform: rotateX(${90 * u}deg);`
    };
}

function fadeInOut (node, { duration = 300, easing = cssEase } = {}) {
    return {
        duration,
        easing,
        css: (t, u) => `opacity: ${Math.max(0, 2 * t - 1)};`
    };
}

function fade (node, { duration = 150, easing = cssEase } = {}) {
    return {
        duration,
        easing,
        css: (t, u) => `opacity: ${t};`
    }
}

export function flipTransition (node) {
    if (get(settings)['reducedMotion']) return fadeInOut(node); else return flip(node);
}

export function halfFlipTransition (node) {
    if (get(settings)['reducedMotion']) return fade(node); else return halfFlip(node);
}
