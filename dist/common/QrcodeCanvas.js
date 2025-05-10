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
var rectangleCanvas_1 = __importDefault(require("./rectangleCanvas"));
var helpers_1 = require("./helpers");
/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
function QrcodeCanvas(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var canvas = (0, react_1.useRef)(null);
    var space = {
        margin: (_a = props.margin) !== null && _a !== void 0 ? _a : 0,
        padding: (_b = props.padding) !== null && _b !== void 0 ? _b : 0,
        total: (((_c = props.margin) !== null && _c !== void 0 ? _c : 0) + ((_d = props.padding) !== null && _d !== void 0 ? _d : 0)) * 2
    };
    var variant = (0, helpers_1.qrCodePartNormalize)('standard', props.variant);
    var color = (0, helpers_1.qrCodePartNormalize)('#000', props.color);
    var colorEffect = (0, helpers_1.qrCodePartNormalize)('none', props.colorEffect);
    var imagem = (0, helpers_1.qrCodeImageNormalize)(props.image);
    var qrcode = (0, qrcode_generator_1.default)((_e = props.modules) !== null && _e !== void 0 ? _e : 0, ((_f = props.level) !== null && _f !== void 0 ? _f : props.image) ? 'H' : 'M');
    qrcode.addData((_g = props.value) !== null && _g !== void 0 ? _g : '', props.mode);
    qrcode.make();
    var modules = qrcode.getModuleCount();
    var size = (_h = props.size) !== null && _h !== void 0 ? _h : modules * 10;
    var moduleSize = size / modules;
    var moduleEyeStart = 7;
    var moduleEyeEnd = modules - moduleEyeStart - 1;
    function addImage(context, imageSet) {
        var image = new Image();
        image.src = imageSet.src;
        image.onload = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var size = Math.floor(modules * moduleSize / 5);
            var position = size * 2 + space.margin + space.padding;
            if (!imageSet.overlap)
                (0, rectangleCanvas_1.default)(context, {
                    height: (_a = imageSet.height) !== null && _a !== void 0 ? _a : size,
                    width: (_b = imageSet.width) !== null && _b !== void 0 ? _b : size,
                    positionX: (_c = imageSet.positionX) !== null && _c !== void 0 ? _c : position,
                    positionY: (_d = imageSet.positionY) !== null && _d !== void 0 ? _d : position,
                    fill: (_e = props.bgColor) !== null && _e !== void 0 ? _e : '#FFF',
                });
            context.drawImage(image, (_f = imageSet.positionX) !== null && _f !== void 0 ? _f : position, (_g = imageSet.positionY) !== null && _g !== void 0 ? _g : position, (_h = imageSet.width) !== null && _h !== void 0 ? _h : size, (_j = imageSet.height) !== null && _j !== void 0 ? _j : size);
        };
    }
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (!canvas.current)
            return;
        var context = canvas.current.getContext('2d');
        if (!context)
            return;
        context.clearRect(0, 0, space.total + size, space.total + size);
        (0, rectangleCanvas_1.default)(context, {
            height: space.padding * 2 + size,
            width: space.padding * 2 + size,
            positionX: space.margin,
            positionY: space.margin,
            fill: (_a = props.bgColor) !== null && _a !== void 0 ? _a : '#FFF',
            radius: props.bgRounded ? 10 : undefined
        });
        for (var row = 0; row < modules; row++) {
            for (var col = 0; col < modules; col++) {
                if (!qrcode.isDark(row, col))
                    continue;
                var key = ((col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd) ||
                    (col > moduleEyeEnd && row < moduleEyeStart)) ? 'eyes' : 'body';
                var changer = {
                    stroke: key === 'body' && props.divider ? ((_b = props.bgColor) !== null && _b !== void 0 ? _b : '#FFF') : null
                };
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
                changer.radius = typeof variant[key] === 'function'
                    ? variant[key](key, moduleSize, modules, wrapped, row, col)
                    : (0, helpers_1.qrCodeStyleRadius)(variant[key], moduleSize, modules, wrapped, row, col, key);
                (0, rectangleCanvas_1.default)(context, __assign({ positionX: col * moduleSize + space.margin + space.padding, positionY: row * moduleSize + space.margin + space.padding, height: moduleSize, width: moduleSize, fill: (0, helpers_1.getColor)(color[key], colorEffect[key], col, row) }, changer));
            }
        }
        if (imagem)
            addImage(context, imagem);
        if (typeof props.onReady === 'function') {
            props.onReady(canvas.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    return react_1.default.createElement("canvas", __assign({}, props.internalProps, { ref: canvas, width: size + space.total, height: size + space.total }), props.children);
}
exports.default = QrcodeCanvas;
