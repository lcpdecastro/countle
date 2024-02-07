import { get } from "svelte/store";
import settings from "./settings.js";

function flip (node, { from = -180, to = 0, ...options } = {}) {
  return {
    ...options,
    css: (t, u) => `transform: rotateX(${u * from + t * to}deg)`
  };
}

function fadeInOut (node, { ...options } = {}) {
  return {
    ...options,
    css: t => `opacity: ${Math.max(0, 2 * t - 1)}`
  };
}

export default function flipTransition (node, options = {}) {
  if (get(settings)['reducedMotion']) return fadeInOut(node, options); else return flip(node, options);
}
