import { get } from "svelte/store";
import settings from "./settings.js";
import cssEase from "./cssEase.js";

function flip (node, { duration = 300, easing = cssEase, from = -180, to = 0 } = {}) {
    return {
        duration,
        easing,
        css: t => `transform: rotateX(${from + ((to - from) * t)}deg)`
    };
}

function fadeInOut (node, { duration = 300, easing = cssEase } = {}) {
    return {
        duration,
        easing,
        css: t => `opacity: ${Math.max(0, 2 * t - 1)};`
    };
}

export default function flipTransition (node, options = {}) {
    if (get(settings)['reducedMotion']) return fadeInOut(node, options); else return flip(node, options);
}
