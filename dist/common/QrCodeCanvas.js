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
var react_1 = __importStar(require("react"));
var qrcode_generator_1 = __importDefault(require("qrcode-generator"));
var canvasRectangle_1 = __importDefault(require("./canvasRectangle"));
function QrCodeCanvas(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var canvas = (0, react_1.useRef)(null);
    var variant = (typeof props.variant === 'object'
        && 'eyes' in props.variant
        && 'body' in props.variant) ? props.variant : {
        eyes: (_a = props.variant) !== null && _a !== void 0 ? _a : 'standard',
        body: (_b = props.variant) !== null && _b !== void 0 ? _b : 'standard'
    };
    var color = (typeof props.color === 'object'
        && 'eyes' in props.color
        && 'body' in props.color) ? props.color : {
        eyes: (_c = props.color) !== null && _c !== void 0 ? _c : '#000',
        body: (_d = props.color) !== null && _d !== void 0 ? _d : '#000'
    };
    var qrcode = (0, qrcode_generator_1.default)((_e = props.modules) !== null && _e !== void 0 ? _e : 0, (_f = props.level) !== null && _f !== void 0 ? _f : (props.imageBig ? 'Q' : 'M'));
    qrcode.addData(props.value, props.mode);
    qrcode.make();
    var modules = qrcode.getModuleCount();
    var size = (_g = props.size) !== null && _g !== void 0 ? _g : modules * 10;
    var moduleSize = size / modules;
    var moduleEyeStart = 7;
    var moduleEyeEnd = modules - moduleEyeStart - 1;
    function addImage(context, src, clear, big) {
        var image = new Image();
        image.src = src;
        image.onload = function () {
            var size = Math.floor(modules * moduleSize / (big ? 3 : 5));
            var position = size * (big ? 1 : 2);
            if (clear)
                context.clearRect(position, position, size, size);
            context.drawImage(image, position, position, size, size);
        };
    }
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (!canvas.current)
            return;
        var context = canvas.current.getContext('2d');
        if (!context)
            return;
        context.clearRect(0, 0, size, size);
        for (var row = 0; row < modules; row++) {
            for (var col = 0; col < modules; col++) {
                if (!qrcode.isDark(row, col))
                    continue;
                var key = (col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd) ||
                    (col > moduleEyeEnd && row < moduleEyeStart)
                    ? 'eyes' : 'body';
                var changer = {
                    stroke: key === 'body' && props.divider ? ((_a = props.bgColor) !== null && _a !== void 0 ? _a : '#FFF') : null
                };
                var radius = moduleSize / 1.4;
                var isDark = {
                    row: {
                        before: row > 0 ? qrcode.isDark(row - 1, col) : false,
                        after: row < modules - 1 ? qrcode.isDark(row + 1, col) : false
                    },
                    col: {
                        before: col > 0 ? qrcode.isDark(row, col - 1) : false,
                        after: col < modules - 1 ? qrcode.isDark(row, col + 1) : false
                    }
                };
                switch (variant[key]) {
                    case 'dots':
                        changer.radius = radius;
                        break;
                    case 'rounded':
                        changer.radius = moduleSize / 2;
                        break;
                    case 'fluid':
                        changer.radius = {
                            top_right: !isDark.col.after && !isDark.row.before ? radius : 0,
                            top_left: !isDark.col.before && !isDark.row.before ? radius : 0,
                            bottom_right: !isDark.col.after && !isDark.row.after ? radius : 0,
                            bottom_left: !isDark.col.before && !isDark.row.after ? radius : 0
                        };
                        break;
                    case 'reverse':
                        changer.radius = {
                            top_right: isDark.col.after && isDark.row.before ? radius : 0,
                            top_left: isDark.col.before && isDark.row.before ? radius : 0,
                            bottom_right: isDark.col.after && isDark.row.after ? radius : 0,
                            bottom_left: isDark.col.before && isDark.row.after ? radius : 0
                        };
                        break;
                    case 'morse':
                        changer.radius = !isDark.col.before && !isDark.col.after ? radius : {
                            top_left: !isDark.col.before ? radius : 0,
                            bottom_left: !isDark.col.before ? radius : 0,
                            top_right: !isDark.col.after ? radius : 0,
                            bottom_right: !isDark.col.after ? radius : 0
                        };
                        break;
                    case 'shower':
                        changer.radius = !isDark.row.before && !isDark.row.after ? radius : {
                            top_left: !isDark.row.before ? radius : 0,
                            top_right: !isDark.row.before ? radius : 0,
                            bottom_left: !isDark.row.after ? radius : 0,
                            bottom_right: !isDark.row.after ? radius : 0
                        };
                        break;
                    case 'gravity':
                        var half = Math.floor(modules / 2) + 1;
                        changer.radius = {
                            top_right: !isDark.col.after && !isDark.row.before && !(row > half && col < half) ? radius : 0,
                            top_left: !isDark.col.before && !isDark.row.before && !(row > half && col > half) ? radius : 0,
                            bottom_right: !isDark.col.after && !isDark.row.after && !(row < half && col < half) ? radius : 0,
                            bottom_left: !isDark.col.before && !isDark.row.after && !(row < half && col > half) ? radius : 0
                        };
                        break;
                }
                (0, canvasRectangle_1.default)(__assign({ canvas2d: context, positionX: col * moduleSize, positionY: row * moduleSize, height: moduleSize, width: moduleSize, fill: color[key] }, changer));
            }
        }
        if (props.image)
            addImage(context, props.image, !props.overlap, (_b = props.imageBig) !== null && _b !== void 0 ? _b : false);
    }, [props]);
    return react_1.default.createElement("canvas", { ref: canvas, width: size, height: size, style: __assign({ margin: props.margin, padding: props.padding, backgroundColor: (_h = props.bgColor) !== null && _h !== void 0 ? _h : '#FFF', borderRadius: props.bgRounded ? 10 : undefined }, ((_j = props.style) !== null && _j !== void 0 ? _j : {})), className: props.className }, props.children);
}
exports.default = QrCodeCanvas;
