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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var qrcode_generator_1 = __importDefault(require("qrcode-generator"));
var react_1 = __importStar(require("react"));
var rectanglePath_1 = __importDefault(require("./rectanglePath"));
var helpers_1 = require("./helpers");
/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
function QrcodeSvg(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var SVG = (0, react_1.useRef)(null);
    var qrcode = (0, qrcode_generator_1.default)((_a = props.modules) !== null && _a !== void 0 ? _a : 0, ((_b = props.level) !== null && _b !== void 0 ? _b : props.image) ? 'H' : 'M');
    qrcode.addData((_c = props.value) !== null && _c !== void 0 ? _c : '', props.mode);
    qrcode.make();
    var modules = qrcode.getModuleCount();
    var size = (_d = props.size) !== null && _d !== void 0 ? _d : modules * 10;
    var moduleSize = size / modules;
    var space = {
        margin: (_e = props.margin) !== null && _e !== void 0 ? _e : 0,
        padding: (_f = props.padding) !== null && _f !== void 0 ? _f : 0,
        total: (((_g = props.margin) !== null && _g !== void 0 ? _g : 0) + ((_h = props.padding) !== null && _h !== void 0 ? _h : 0)) * 2
    };
    var variant = (0, helpers_1.qrCodePartNormalize)('standard', props.variant);
    var color = (0, helpers_1.qrCodePartNormalize)('#000', props.color);
    var colorEffect = (0, helpers_1.qrCodePartNormalize)('none', props.colorEffect);
    var Image = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!props.image)
            return react_1.default.createElement(react_1.default.Fragment, null);
        var image = (0, helpers_1.qrCodeImageNormalize)(props.image);
        var size = Math.floor(modules * moduleSize / 5);
        var position = size * 2 + space.margin + space.padding;
        var _k = react_1.default.useState(), src = _k[0], setSrc = _k[1];
        (0, react_1.useEffect)(function () {
            if (src)
                return;
            (0, helpers_1.loadImageAsBase64)(image.src).then(setSrc);
        }, [props.image]);
        if (!src)
            return react_1.default.createElement(react_1.default.Fragment, null);
        return react_1.default.createElement(react_1.default.Fragment, null,
            image.overlap ? react_1.default.createElement(react_1.default.Fragment, null) : (react_1.default.createElement("rect", { width: (_a = image.width) !== null && _a !== void 0 ? _a : size, height: (_b = image.height) !== null && _b !== void 0 ? _b : size, x: (_c = image.positionX) !== null && _c !== void 0 ? _c : position, y: (_d = image.positionY) !== null && _d !== void 0 ? _d : position, fill: (_e = props.bgColor) !== null && _e !== void 0 ? _e : '#FFF' })),
            react_1.default.createElement("image", { href: src, width: (_f = image.width) !== null && _f !== void 0 ? _f : size, height: (_g = image.height) !== null && _g !== void 0 ? _g : size, x: (_h = image.positionX) !== null && _h !== void 0 ? _h : position, y: (_j = image.positionY) !== null && _j !== void 0 ? _j : position, preserveAspectRatio: "xMidYMid meet" }));
    };
    var rects = [];
    for (var row = 0; row < modules; row++) {
        for (var col = 0; col < modules; col++) {
            if (!qrcode.isDark(row, col))
                continue;
            var key = ((col < 7 && row < 7) ||
                (col < 7 && row >= modules - 7) ||
                (col >= modules - 7 && row < 7)) ? 'eyes' : 'body';
            var x = col * moduleSize + space.margin + space.padding;
            var y = row * moduleSize + space.margin + space.padding;
            var c = (0, helpers_1.getColor)(color[key], colorEffect[key], col, row);
            var wrapped = {
                row: {
                    before: row > 0 ? qrcode.isDark(row - 1, col) : false,
                    after: row < modules - 1 ? qrcode.isDark(row + 1, col) : false
                },
                col: {
                    before: col > 0 ? qrcode.isDark(row, col - 1) : false,
                    after: col < modules - 1 ? qrcode.isDark(row, col + 1) : false
                }
            };
            rects.push(react_1.default.createElement("path", { d: (0, rectanglePath_1.default)({
                    height: moduleSize,
                    width: moduleSize,
                    positionX: x,
                    positionY: y,
                    radius: (0, helpers_1.qrCodeStyleRadius)(variant[key], moduleSize, modules, wrapped, row, col, key)
                }), key: "".concat(row, "-").concat(col), fill: c, stroke: props.divider && key === 'body' ? ((_j = props.bgColor) !== null && _j !== void 0 ? _j : '#FFF') : undefined }));
        }
    }
    (0, react_1.useEffect)(function () {
        if (typeof props.onReady === 'function' && SVG.current) {
            props.onReady(SVG.current);
        }
    }, [props, SVG]);
    return (react_1.default.createElement("svg", __assign({}, props.internalProps, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 ".concat(size + space.total, " ").concat(size + space.total), width: size + space.total, height: size + space.total, ref: SVG }),
        react_1.default.createElement("rect", { x: space.margin, y: space.margin, width: size + space.padding * 2, height: size + space.padding * 2, fill: (_k = props.bgColor) !== null && _k !== void 0 ? _k : '#FFF', rx: props.bgRounded ? 10 : 0 }),
        rects,
        react_1.default.createElement(Image, null)));
}
exports.default = QrcodeSvg;
