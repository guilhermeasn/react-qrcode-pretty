"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomColor = exports.colorGradient = void 0;
function colorHexToRGB(hex) {
    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (_, r, g, b) { return (r + r + g + g + b + b); });
    var result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
function colorRGBtoHex(_a) {
    var r = _a.r, g = _a.g, b = _a.b;
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
function colorGradient(color, level) {
    var rgb = colorHexToRGB(color);
    for (var k in rgb) {
        rgb[k] += level;
        if (rgb[k] > 255)
            rgb[k] = 255;
        if (rgb[k] < 0)
            rgb[k] = 0;
    }
    return colorRGBtoHex(rgb);
}
exports.colorGradient = colorGradient;
function colorLevel(color) {
    var sum = Object.values(colorHexToRGB(color)).reduce(function (t, c) { return t + c; }, 0);
    return sum > 510 ? 'light' : sum > 255 ? 'medium' : 'dark';
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor(colorBase) {
    var level = colorLevel(colorBase);
    var min = level === 'dark' ? 0 : level === 'medium' ? 63 : 127;
    var max = level === 'dark' ? 127 : level === 'medium' ? 191 : 255;
    return colorRGBtoHex({ r: getRandomInt(min, max), g: getRandomInt(min, max), b: getRandomInt(min, max) });
}
exports.getRandomColor = getRandomColor;
