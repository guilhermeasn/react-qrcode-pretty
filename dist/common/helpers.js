"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColor = exports.qrCodeStyleRadius = exports.qrCodeRadiusNormalize = exports.qrCodeImageNormalize = exports.qrCodePartNormalize = exports.getRandomColor = exports.colorGradient = void 0;
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
function qrCodePartNormalize(defaultReturn, part) {
    return (part
        && typeof part === 'object'
        && 'eyes' in part
        && 'body' in part) ? part : {
        eyes: part !== null && part !== void 0 ? part : defaultReturn,
        body: part !== null && part !== void 0 ? part : defaultReturn
    };
}
exports.qrCodePartNormalize = qrCodePartNormalize;
function qrCodeImageNormalize(imageSet) {
    if (imageSet && typeof imageSet === 'object')
        return imageSet;
    if (typeof imageSet === 'string')
        return { src: imageSet };
    return null;
}
exports.qrCodeImageNormalize = qrCodeImageNormalize;
function qrCodeRadiusNormalize(radius) {
    return (typeof radius === 'number' || !radius) ? {
        top_left: radius !== null && radius !== void 0 ? radius : 0, top_right: radius !== null && radius !== void 0 ? radius : 0,
        bottom_left: radius !== null && radius !== void 0 ? radius : 0, bottom_right: radius !== null && radius !== void 0 ? radius : 0
    } : __assign({ top_left: 0, top_right: 0, bottom_left: 0, bottom_right: 0 }, radius);
}
exports.qrCodeRadiusNormalize = qrCodeRadiusNormalize;
function qrCodeStyleRadius(variant, moduleSize, modules, wrapped, row, col) {
    var radius = moduleSize / 1.6;
    switch (variant) {
        case 'dots': return radius;
        case 'rounded': return moduleSize / 2;
        case 'circle': return {
            top_left: !wrapped.col.before && !wrapped.row.before && wrapped.col.after && wrapped.row.after ? moduleSize * 1.35 : 0,
            top_right: wrapped.col.before && !wrapped.row.before && !wrapped.col.after && wrapped.row.after ? moduleSize * 1.35 : 0,
            bottom_left: !wrapped.col.before && wrapped.row.before && wrapped.col.after && !wrapped.row.after ? moduleSize * 1.35 : 0,
            bottom_right: wrapped.col.before && wrapped.row.before && !wrapped.col.after && !wrapped.row.after ? moduleSize * 1.35 : 0
        };
        case 'fluid': return {
            top_right: !wrapped.col.after && !wrapped.row.before ? radius : 0,
            top_left: !wrapped.col.before && !wrapped.row.before ? radius : 0,
            bottom_right: !wrapped.col.after && !wrapped.row.after ? radius : 0,
            bottom_left: !wrapped.col.before && !wrapped.row.after ? radius : 0
        };
        case 'reverse': return {
            top_right: wrapped.col.after && wrapped.row.before ? radius : 0,
            top_left: wrapped.col.before && wrapped.row.before ? radius : 0,
            bottom_right: wrapped.col.after && wrapped.row.after ? radius : 0,
            bottom_left: wrapped.col.before && wrapped.row.after ? radius : 0
        };
        case 'morse': return !wrapped.col.before && !wrapped.col.after ? radius : {
            top_left: !wrapped.col.before ? radius : 0,
            bottom_left: !wrapped.col.before ? radius : 0,
            top_right: !wrapped.col.after ? radius : 0,
            bottom_right: !wrapped.col.after ? radius : 0
        };
        case 'shower': return !wrapped.row.before && !wrapped.row.after ? radius : {
            top_left: !wrapped.row.before ? radius : 0,
            top_right: !wrapped.row.before ? radius : 0,
            bottom_left: !wrapped.row.after ? radius : 0,
            bottom_right: !wrapped.row.after ? radius : 0
        };
        case 'gravity':
            var half = Math.floor(modules / 2);
            return {
                top_right: !wrapped.col.after && !wrapped.row.before && !(row > half && col < half) ? radius : 0,
                top_left: !wrapped.col.before && !wrapped.row.before && !(row > half && col > half) ? radius : 0,
                bottom_right: !wrapped.col.after && !wrapped.row.after && !(row < half && col < half) ? radius : 0,
                bottom_left: !wrapped.col.before && !wrapped.row.after && !(row < half && col > half) ? radius : 0
            };
        default: return 0;
    }
}
exports.qrCodeStyleRadius = qrCodeStyleRadius;
function getColor(color, effect, col, row) {
    switch (effect) {
        case 'gradient-dark-vertical': return colorGradient(color, row * -3);
        case 'gradient-dark-horizontal': return colorGradient(color, col * -3);
        case 'gradient-dark-diagonal': return colorGradient(color, (col + row) * -2);
        case 'gradient-light-vertical': return colorGradient(color, row * 3);
        case 'gradient-light-horizontal': return colorGradient(color, col * 3);
        case 'gradient-light-diagonal': return colorGradient(color, (col + row) * 2);
        case 'colored': return getRandomColor(color);
        default: return color;
    }
}
exports.getColor = getColor;
