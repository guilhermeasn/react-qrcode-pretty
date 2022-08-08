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
function canvasRectangle(props) {
    var _a, _b, _c, _d;
    var radius = (typeof props.radius === 'number' || !props.radius) ? {
        top_left: (_a = props.radius) !== null && _a !== void 0 ? _a : 0,
        top_right: (_b = props.radius) !== null && _b !== void 0 ? _b : 0,
        bottom_left: (_c = props.radius) !== null && _c !== void 0 ? _c : 0,
        bottom_right: (_d = props.radius) !== null && _d !== void 0 ? _d : 0
    } : __assign({ top_left: 0, top_right: 0, bottom_left: 0, bottom_right: 0 }, props.radius);
    props.canvas2d.beginPath();
    props.canvas2d.moveTo(props.positionX + radius.top_left, props.positionY);
    props.canvas2d.lineTo(props.positionX + props.width - radius.top_right, props.positionY);
    props.canvas2d.quadraticCurveTo(props.positionX + props.width, props.positionY, props.positionX + props.width, props.positionY + radius.top_right);
    props.canvas2d.lineTo(props.positionX + props.width, props.positionY + props.height - radius.bottom_right);
    props.canvas2d.quadraticCurveTo(props.positionX + props.width, props.positionY + props.height, props.positionX + props.width - radius.bottom_right, props.positionY + props.height);
    props.canvas2d.lineTo(props.positionX + radius.bottom_left, props.positionY + props.height);
    props.canvas2d.quadraticCurveTo(props.positionX, props.positionY + props.height, props.positionX, props.positionY + props.height - radius.bottom_left);
    props.canvas2d.lineTo(props.positionX, props.positionY + radius.top_left);
    props.canvas2d.quadraticCurveTo(props.positionX, props.positionY, props.positionX + radius.top_left, props.positionY);
    if (props.fill) {
        props.canvas2d.fillStyle = props.fill;
        props.canvas2d.fill();
    }
    if (props.stroke) {
        props.canvas2d.strokeStyle = props.stroke;
        props.canvas2d.stroke();
    }
    props.canvas2d.closePath();
}
exports.default = canvasRectangle;
