export default function cssEase (x) {
    let a = Math.cbrt(Math.sqrt(256 * x ** 2 - 80 * x + 13) / 32 + (32 * x - 5) / 64);
    let t = a - 3 / (16 * a) + 1 / 4;
    return (0.3 * (1 - t) ** 2 * t + 3 * (1 - t) * t ** 2 + t ** 3);
}
