function colorHexToRGB(hex) {
    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => (r + r + g + g + b + b));
    const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
function colorRGBtoHex({ r, g, b }) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
export function colorGradient(color, level) {
    const rgb = colorHexToRGB(color);
    for (let k in rgb) {
        rgb[k] += level;
        if (rgb[k] > 255)
            rgb[k] = 255;
        if (rgb[k] < 0)
            rgb[k] = 0;
    }
    return colorRGBtoHex(rgb);
}
function colorLevel(color) {
    const sum = Object.values(colorHexToRGB(color)).reduce((t, c) => t + c, 0);
    return sum > 510 ? 'light' : sum > 255 ? 'medium' : 'dark';
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomColor(colorBase) {
    const level = colorLevel(colorBase);
    const min = level === 'dark' ? 0 : level === 'medium' ? 63 : 127;
    const max = level === 'dark' ? 127 : level === 'medium' ? 191 : 255;
    return colorRGBtoHex({ r: getRandomInt(min, max), g: getRandomInt(min, max), b: getRandomInt(min, max) });
}
