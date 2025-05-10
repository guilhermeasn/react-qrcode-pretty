"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQrcodeDownload = exports.QrcodeSVG = exports.QrcodeCanvas = void 0;
var downloadjs_1 = __importDefault(require("downloadjs"));
var react_1 = require("react");
var QrcodeCanvas_1 = require("./QrcodeCanvas");
Object.defineProperty(exports, "QrcodeCanvas", { enumerable: true, get: function () { return __importDefault(QrcodeCanvas_1).default; } });
var QrcodeSVG_1 = require("./QrcodeSVG");
Object.defineProperty(exports, "QrcodeSVG", { enumerable: true, get: function () { return __importDefault(QrcodeSVG_1).default; } });
/**
 * React Hook to download Qrcode Canvas (PNG) or SVG
 * @param [suffix=''] add a suffix to the file name to download
 * @returns [ setQrcode, download, isReady ]
 */
function useQrcodeDownload(suffix) {
    if (suffix === void 0) { suffix = ''; }
    var _a = (0, react_1.useState)(null), qrcode = _a[0], setQrcode = _a[1];
    var isCanvas = qrcode instanceof HTMLCanvasElement;
    return [
        setQrcode,
        function (fileName) {
            if (qrcode)
                (0, downloadjs_1.default)(isCanvas ? qrcode.toDataURL('image/png') : new Blob([qrcode.outerHTML], { type: "image/svg+xml;charset=utf-8" }), fileName + suffix + (isCanvas ? '.png' : '.svg'), isCanvas ? 'image/png' : 'image/svg+xml');
        },
        qrcode !== null
    ];
}
exports.useQrcodeDownload = useQrcodeDownload;
