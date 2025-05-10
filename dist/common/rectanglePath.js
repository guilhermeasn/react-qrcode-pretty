"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
function rectanglePath(props) {
    var radius = (0, helpers_1.qrCodeRadiusNormalize)(props.radius);
    return "\n        M ".concat(props.positionX + radius.top_left, ",").concat(props.positionY, "\n        H ").concat(props.positionX + props.width - radius.top_right, "\n        A ").concat(radius.top_right, ",").concat(radius.top_right, " 0 0 1 ").concat(props.positionX + props.width, ",").concat(props.positionY + radius.top_right, "\n        V ").concat(props.positionY + props.height - radius.bottom_right, "\n        A ").concat(radius.bottom_right, ",").concat(radius.bottom_right, " 0 0 1 ").concat(props.positionX + props.width - radius.bottom_right, ",").concat(props.positionY + props.height, "\n        H ").concat(props.positionX + radius.bottom_left, "\n        A ").concat(radius.bottom_left, ",").concat(radius.bottom_left, " 0 0 1 ").concat(props.positionX, ",").concat(props.positionY + props.height - radius.bottom_left, "\n        V ").concat(props.positionY + radius.top_left, "\n        A ").concat(radius.top_left, ",").concat(radius.top_left, " 0 0 1 ").concat(props.positionX + radius.top_left, ",").concat(props.positionY, "\n        Z\n    ").trim().replace(/\s+/g, ' ');
}
exports.default = rectanglePath;
