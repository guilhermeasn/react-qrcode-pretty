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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImageAsBase64 = exports.getColor = exports.qrCodeStyleRadius = exports.qrCodeRadiusNormalize = exports.qrCodeImageNormalize = exports.qrCodePartNormalize = exports.getRandomColor = exports.colorGradient = void 0;
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
function loadImageAsBase64(src) {
    return __awaiter(this, void 0, void 0, function () {
        var response, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(src)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) {
                            var reader = new FileReader();
                            reader.onloadend = function () { return resolve(reader.result); };
                            reader.readAsDataURL(blob);
                        })];
            }
        });
    });
}
exports.loadImageAsBase64 = loadImageAsBase64;
