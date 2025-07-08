"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  QrcodeCanvas: () => QrcodeCanvas_default,
  QrcodeSVG: () => QrcodeSVG_default,
  useQrcodeDownload: () => useQrcodeDownload
});
module.exports = __toCommonJS(index_exports);
var import_downloadjs = __toESM(require("downloadjs"));
var import_react3 = require("react");

// src/QrcodeCanvas.tsx
var import_qrcode_generator = __toESM(require("qrcode-generator"));
var import_react = require("react");

// src/helpers.ts
function colorHexToRGB(hex) {
  hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
  const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}
function colorRGBtoHex({ r, g, b }) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
function colorGradient(color, level) {
  const rgb = colorHexToRGB(color);
  for (let k in rgb) {
    rgb[k] += level;
    if (rgb[k] > 255) rgb[k] = 255;
    if (rgb[k] < 0) rgb[k] = 0;
  }
  return colorRGBtoHex(rgb);
}
function getShadeColor(colorBase) {
  const { r, g, b } = colorHexToRGB(colorBase);
  const max = Math.min(r, g, b);
  const random = getRandomInt(0, max);
  return colorRGBtoHex({ r: r - random, g: g - random, b: b - random });
}
function colorLevel(color) {
  const sum = Object.values(colorHexToRGB(color)).reduce((t, c) => t + c, 0);
  return sum > 510 ? "light" : sum > 255 ? "medium" : "dark";
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor(colorBase) {
  const level = colorLevel(colorBase);
  const min = level === "dark" ? 0 : level === "medium" ? 63 : 127;
  const max = level === "dark" ? 127 : level === "medium" ? 191 : 255;
  return colorRGBtoHex({ r: getRandomInt(min, max), g: getRandomInt(min, max), b: getRandomInt(min, max) });
}
function qrCodePartNormalize(defaultReturn, part) {
  return part && typeof part === "object" && "eyes" in part && "body" in part ? part : {
    eyes: part != null ? part : defaultReturn,
    body: part != null ? part : defaultReturn
  };
}
function qrCodeImageNormalize(imageSet) {
  if (imageSet && typeof imageSet === "object") return imageSet;
  if (typeof imageSet === "string") return { src: imageSet };
  return null;
}
function qrCodeRadiusNormalize(radius) {
  return typeof radius === "number" || !radius ? {
    top_left: radius != null ? radius : 0,
    top_right: radius != null ? radius : 0,
    bottom_left: radius != null ? radius : 0,
    bottom_right: radius != null ? radius : 0
  } : {
    top_left: 0,
    top_right: 0,
    bottom_left: 0,
    bottom_right: 0,
    ...radius
  };
}
function qrCodeStyleRadius(variant, moduleSize, modules, wrapped, row, col, key) {
  const radius = moduleSize / 1.6;
  switch (variant) {
    case "dots":
      return radius;
    case "rounded":
      return moduleSize / 2;
    case "circle":
      return {
        top_left: !wrapped.col.before && !wrapped.row.before && wrapped.col.after && wrapped.row.after ? moduleSize * 1.35 : 0,
        top_right: wrapped.col.before && !wrapped.row.before && !wrapped.col.after && wrapped.row.after ? moduleSize * 1.35 : 0,
        bottom_left: !wrapped.col.before && wrapped.row.before && wrapped.col.after && !wrapped.row.after ? moduleSize * 1.35 : 0,
        bottom_right: wrapped.col.before && wrapped.row.before && !wrapped.col.after && !wrapped.row.after ? moduleSize * 1.35 : 0
      };
    case "fluid":
      return {
        top_right: !wrapped.col.after && !wrapped.row.before ? radius : 0,
        top_left: !wrapped.col.before && !wrapped.row.before ? radius : 0,
        bottom_right: !wrapped.col.after && !wrapped.row.after ? radius : 0,
        bottom_left: !wrapped.col.before && !wrapped.row.after ? radius : 0
      };
    case "reverse":
      return {
        top_right: wrapped.col.after && wrapped.row.before ? radius : 0,
        top_left: wrapped.col.before && wrapped.row.before ? radius : 0,
        bottom_right: wrapped.col.after && wrapped.row.after ? radius : 0,
        bottom_left: wrapped.col.before && wrapped.row.after ? radius : 0
      };
    case "morse":
      return !wrapped.col.before && !wrapped.col.after ? radius : {
        top_left: !wrapped.col.before ? radius : 0,
        bottom_left: !wrapped.col.before ? radius : 0,
        top_right: !wrapped.col.after ? radius : 0,
        bottom_right: !wrapped.col.after ? radius : 0
      };
    case "shower":
      return !wrapped.row.before && !wrapped.row.after ? radius : {
        top_left: !wrapped.row.before ? radius : 0,
        top_right: !wrapped.row.before ? radius : 0,
        bottom_left: !wrapped.row.after ? radius : 0,
        bottom_right: !wrapped.row.after ? radius : 0
      };
    case "gravity":
      const half = Math.floor(modules / 2);
      return {
        top_right: !wrapped.col.after && !wrapped.row.before && !(row > half && col < half) ? radius : 0,
        top_left: !wrapped.col.before && !wrapped.row.before && !(row > half && col > half) ? radius : 0,
        bottom_right: !wrapped.col.after && !wrapped.row.after && !(row < half && col < half) ? radius : 0,
        bottom_left: !wrapped.col.before && !wrapped.row.after && !(row < half && col > half) ? radius : 0
      };
    case "italic":
      return {
        top_right: 0,
        top_left: !wrapped.col.before && !wrapped.row.before ? key === "eyes" ? moduleSize * 1.2 : radius : 0,
        bottom_right: !wrapped.col.after && !wrapped.row.after ? key === "eyes" ? moduleSize * 1.2 : radius : 0,
        bottom_left: 0
      };
    case "inclined":
      return {
        top_right: !wrapped.col.after && !wrapped.row.before ? key === "eyes" ? moduleSize * 1.2 : radius : 0,
        top_left: 0,
        bottom_right: 0,
        bottom_left: !wrapped.col.before && !wrapped.row.after ? key === "eyes" ? moduleSize * 1.2 : radius : 0
      };
    default:
      return 0;
  }
}
function getColor(color, effect, col, row) {
  switch (effect) {
    case "gradient-dark-vertical":
      return colorGradient(color, row * -3);
    case "gradient-dark-horizontal":
      return colorGradient(color, col * -3);
    case "gradient-dark-diagonal":
      return colorGradient(color, (col + row) * -2);
    case "gradient-light-vertical":
      return colorGradient(color, row * 3);
    case "gradient-light-horizontal":
      return colorGradient(color, col * 3);
    case "gradient-light-diagonal":
      return colorGradient(color, (col + row) * 2);
    case "shades":
      return getShadeColor(color);
    case "colored":
      return getRandomColor(color);
    default:
      return color;
  }
}
async function loadImageAsBase64(src) {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
function qrcodeData(props, modules) {
  var _a, _b, _c;
  const margin = Math.floor((_a = props.margin) != null ? _a : 0);
  const padding = Math.floor((_b = props.padding) != null ? _b : 0);
  const space = (margin + padding) * 2;
  const moduleSize = Math.floor(((_c = props.size) != null ? _c : modules * 10) / modules);
  const qrcodeSize = modules * moduleSize;
  const moduleEyeStart = 7;
  const moduleEyeEnd = modules - moduleEyeStart - 1;
  const variant = qrCodePartNormalize("standard", props.variant);
  const color = qrCodePartNormalize("#000", props.color);
  const colorEffect = qrCodePartNormalize("none", props.colorEffect);
  const imagem = qrCodeImageNormalize(props.image);
  return {
    margin,
    padding,
    space,
    moduleSize,
    qrcodeSize,
    moduleEyeStart,
    moduleEyeEnd,
    variant,
    color,
    colorEffect,
    imagem
  };
}

// src/rectangleCanvas.ts
function rectangleCanvas(context, props) {
  const radius = qrCodeRadiusNormalize(props.radius);
  context.beginPath();
  context.moveTo(props.positionX + radius.top_left, props.positionY);
  context.lineTo(props.positionX + props.width - radius.top_right, props.positionY);
  context.quadraticCurveTo(props.positionX + props.width, props.positionY, props.positionX + props.width, props.positionY + radius.top_right);
  context.lineTo(props.positionX + props.width, props.positionY + props.height - radius.bottom_right);
  context.quadraticCurveTo(props.positionX + props.width, props.positionY + props.height, props.positionX + props.width - radius.bottom_right, props.positionY + props.height);
  context.lineTo(props.positionX + radius.bottom_left, props.positionY + props.height);
  context.quadraticCurveTo(props.positionX, props.positionY + props.height, props.positionX, props.positionY + props.height - radius.bottom_left);
  context.lineTo(props.positionX, props.positionY + radius.top_left);
  context.quadraticCurveTo(props.positionX, props.positionY, props.positionX + radius.top_left, props.positionY);
  if (props.fill) {
    context.fillStyle = props.fill;
    context.fill();
  }
  if (props.stroke) {
    context.strokeStyle = props.stroke;
    context.stroke();
  }
  context.closePath();
}

// src/QrcodeCanvas.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function QrcodeCanvas(props) {
  var _a, _b, _c;
  const canvas = (0, import_react.useRef)(null);
  const qrcode = (0, import_qrcode_generator.default)((_a = props.modules) != null ? _a : 0, (_b = props.level) != null ? _b : props.image ? "H" : "M");
  qrcode.addData((_c = props.value) != null ? _c : "", props.mode);
  qrcode.make();
  const modules = qrcode.getModuleCount();
  const {
    margin,
    padding,
    space,
    moduleSize,
    qrcodeSize,
    moduleEyeStart,
    moduleEyeEnd,
    variant,
    color,
    colorEffect,
    imagem
  } = qrcodeData(props, modules);
  (0, import_react.useEffect)(() => {
    var _a2, _b2;
    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, space + qrcodeSize, space + qrcodeSize);
    rectangleCanvas(context, {
      height: padding * 2 + qrcodeSize,
      width: padding * 2 + qrcodeSize,
      positionX: margin,
      positionY: margin,
      fill: (_a2 = props.bgColor) != null ? _a2 : "#FFF",
      radius: props.bgRounded ? 10 : void 0
    });
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (!qrcode.isDark(row, col)) continue;
        let key = col < moduleEyeStart && row < moduleEyeStart || col < moduleEyeStart && row > moduleEyeEnd || col > moduleEyeEnd && row < moduleEyeStart ? "eyes" : "body";
        let changer = {
          stroke: key === "body" && props.divider ? (_b2 = props.bgColor) != null ? _b2 : "#FFF" : null
        };
        const wrapped = {
          row: {
            before: row > 0 ? qrcode.isDark(row - 1, col) : false,
            after: row < modules - 1 ? qrcode.isDark(row + 1, col) : false
          },
          col: {
            before: col > 0 ? qrcode.isDark(row, col - 1) : false,
            after: col < modules - 1 ? qrcode.isDark(row, col + 1) : false
          }
        };
        changer.radius = qrCodeStyleRadius(
          variant[key],
          moduleSize,
          modules,
          wrapped,
          row,
          col,
          key
        );
        rectangleCanvas(context, {
          positionX: col * moduleSize + margin + padding,
          positionY: row * moduleSize + margin + padding,
          height: moduleSize,
          width: moduleSize,
          fill: getColor(color[key], colorEffect[key], col, row),
          ...changer
        });
      }
    }
    if (imagem) addImage(
      context,
      imagem,
      modules,
      moduleSize,
      margin,
      padding,
      props.bgColor
    );
    if (typeof props.onReady === "function") {
      props.onReady(canvas.current);
    }
  }, [props]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "canvas",
    {
      ...props.internalProps,
      ref: canvas,
      width: qrcodeSize + space,
      height: qrcodeSize + space,
      children: props.children
    }
  );
}
function addImage(context, imageSet, modules, moduleSize, margin, padding, bgColor) {
  const image = new Image();
  image.src = imageSet.src;
  image.onload = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const size = Math.floor(modules * moduleSize / 5);
    const position = size * 2 + margin + padding;
    if (!imageSet.overlap) rectangleCanvas(context, {
      height: (_a = imageSet.height) != null ? _a : size,
      width: (_b = imageSet.width) != null ? _b : size,
      positionX: (_c = imageSet.positionX) != null ? _c : position,
      positionY: (_d = imageSet.positionY) != null ? _d : position,
      fill: bgColor != null ? bgColor : "#FFF"
    });
    context.drawImage(
      image,
      (_e = imageSet.positionX) != null ? _e : position,
      (_f = imageSet.positionY) != null ? _f : position,
      (_g = imageSet.width) != null ? _g : size,
      (_h = imageSet.height) != null ? _h : size
    );
  };
}
var QrcodeCanvas_default = QrcodeCanvas;

// src/QrcodeSVG.tsx
var import_qrcode_generator2 = __toESM(require("qrcode-generator"));
var import_react2 = __toESM(require("react"));

// src/rectanglePath.ts
function rectanglePath(props) {
  const radius = qrCodeRadiusNormalize(props.radius);
  return `
      M ${props.positionX + radius.top_left},${props.positionY}
      H ${props.positionX + props.width - radius.top_right}
      A ${radius.top_right},${radius.top_right} 0 0 1 ${props.positionX + props.width},${props.positionY + radius.top_right}
      V ${props.positionY + props.height - radius.bottom_right}
      A ${radius.bottom_right},${radius.bottom_right} 0 0 1 ${props.positionX + props.width - radius.bottom_right},${props.positionY + props.height}
      H ${props.positionX + radius.bottom_left}
      A ${radius.bottom_left},${radius.bottom_left} 0 0 1 ${props.positionX},${props.positionY + props.height - radius.bottom_left}
      V ${props.positionY + radius.top_left}
      A ${radius.top_left},${radius.top_left} 0 0 1 ${props.positionX + radius.top_left},${props.positionY}
      Z
  `.trim().replace(/\s+/g, " ");
}

// src/QrcodeSVG.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function QrcodeSvg(props) {
  var _a, _b, _c, _d, _e;
  const SVG = (0, import_react2.useRef)(null);
  const qrcode = (0, import_qrcode_generator2.default)((_a = props.modules) != null ? _a : 0, (_b = props.level) != null ? _b : props.image ? "H" : "M");
  qrcode.addData((_c = props.value) != null ? _c : "", props.mode);
  qrcode.make();
  const modules = qrcode.getModuleCount();
  const {
    margin,
    padding,
    space,
    moduleSize,
    qrcodeSize,
    moduleEyeStart,
    moduleEyeEnd,
    variant,
    color,
    colorEffect,
    imagem
  } = qrcodeData(props, modules);
  const rects = [];
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qrcode.isDark(row, col)) continue;
      const key = col < 7 && row < 7 || col < 7 && row >= modules - 7 || col >= modules - 7 && row < 7 ? "eyes" : "body";
      const x = col * moduleSize + margin + padding;
      const y = row * moduleSize + margin + padding;
      const c = getColor(color[key], colorEffect[key], col, row);
      const wrapped = {
        row: {
          before: row > 0 ? qrcode.isDark(row - 1, col) : false,
          after: row < modules - 1 ? qrcode.isDark(row + 1, col) : false
        },
        col: {
          before: col > 0 ? qrcode.isDark(row, col - 1) : false,
          after: col < modules - 1 ? qrcode.isDark(row, col + 1) : false
        }
      };
      rects.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "path",
          {
            d: rectanglePath({
              height: moduleSize,
              width: moduleSize,
              positionX: x,
              positionY: y,
              radius: qrCodeStyleRadius(
                variant[key],
                moduleSize,
                modules,
                wrapped,
                row,
                col,
                key
              )
            }),
            fill: c,
            stroke: props.divider && key === "body" ? (_d = props.bgColor) != null ? _d : "#FFF" : void 0
          },
          `${row}-${col}`
        )
      );
    }
  }
  (0, import_react2.useEffect)(() => {
    if (typeof props.onReady === "function" && SVG.current) {
      props.onReady(SVG.current);
    }
  }, [props, SVG]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      shapeRendering: "geometricPrecision",
      ...props.internalProps,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${qrcodeSize + space} ${qrcodeSize + space}`,
      width: qrcodeSize + space,
      height: qrcodeSize + space,
      ref: SVG,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "rect",
          {
            x: margin,
            y: margin,
            width: qrcodeSize + padding * 2,
            height: qrcodeSize + padding * 2,
            fill: (_e = props.bgColor) != null ? _e : "#FFF",
            rx: props.bgRounded ? 10 : 0
          }
        ),
        rects,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          Image2,
          {
            imageSet: imagem,
            modules,
            moduleSize,
            margin,
            padding,
            bgColor: props.bgColor
          }
        )
      ]
    }
  );
}
function Image2({
  imageSet,
  modules,
  moduleSize,
  margin,
  padding,
  bgColor
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const size = Math.floor(modules * moduleSize / 5);
  const position = size * 2 + margin + padding;
  const [src, setSrc] = import_react2.default.useState();
  (0, import_react2.useEffect)(() => {
    if (src || !imageSet) return;
    loadImageAsBase64(imageSet.src).then(setSrc);
  }, [imageSet, src]);
  if (!src || !imageSet) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, {});
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    imageSet.overlap ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, {}) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "rect",
      {
        width: (_a = imageSet.width) != null ? _a : size,
        height: (_b = imageSet.height) != null ? _b : size,
        x: (_c = imageSet.positionX) != null ? _c : position,
        y: (_d = imageSet.positionY) != null ? _d : position,
        fill: bgColor != null ? bgColor : "#FFF"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "image",
      {
        href: src,
        width: (_e = imageSet.width) != null ? _e : size,
        height: (_f = imageSet.height) != null ? _f : size,
        x: (_g = imageSet.positionX) != null ? _g : position,
        y: (_h = imageSet.positionY) != null ? _h : position,
        preserveAspectRatio: "xMidYMid meet"
      }
    )
  ] });
}
var QrcodeSVG_default = QrcodeSvg;

// src/index.ts
function useQrcodeDownload(suffix = "") {
  const [qrcode, setQrcode] = (0, import_react3.useState)(null);
  const isCanvas = qrcode instanceof HTMLCanvasElement;
  return [
    setQrcode,
    (fileName) => {
      if (qrcode) (0, import_downloadjs.default)(
        isCanvas ? qrcode.toDataURL("image/png") : new Blob([qrcode.outerHTML], { type: "image/svg+xml;charset=utf-8" }),
        fileName + suffix + (isCanvas ? ".png" : ".svg"),
        isCanvas ? "image/png" : "image/svg+xml"
      );
    },
    qrcode !== null
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QrcodeCanvas,
  QrcodeSVG,
  useQrcodeDownload
});
//# sourceMappingURL=index.js.map