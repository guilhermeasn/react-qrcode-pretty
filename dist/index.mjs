// src/index.ts
import download from "downloadjs";
import { useState } from "react";

// src/QrcodeCanvas.tsx
import qrcodeGenerator from "qrcode-generator";
import { useEffect, useRef } from "react";

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
import { jsx } from "react/jsx-runtime";
function QrcodeCanvas(props) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const canvas = useRef(null);
  const space = {
    margin: Math.floor((_a = props.margin) != null ? _a : 0),
    padding: Math.floor((_b = props.padding) != null ? _b : 0),
    total: (Math.floor((_c = props.margin) != null ? _c : 0) + Math.floor((_d = props.padding) != null ? _d : 0)) * 2
  };
  const variant = qrCodePartNormalize("standard", props.variant);
  const color = qrCodePartNormalize("#000", props.color);
  const colorEffect = qrCodePartNormalize("none", props.colorEffect);
  const imagem = qrCodeImageNormalize(props.image);
  const qrcode = qrcodeGenerator((_e = props.modules) != null ? _e : 0, (_f = props.level) != null ? _f : props.image ? "H" : "M");
  qrcode.addData((_g = props.value) != null ? _g : "", props.mode);
  qrcode.make();
  const modules = qrcode.getModuleCount();
  const rawModuleSize = ((_h = props.size) != null ? _h : modules * 10) / modules;
  const moduleSize = Math.floor(rawModuleSize);
  const size = moduleSize * modules;
  const moduleEyeStart = 7;
  const moduleEyeEnd = modules - moduleEyeStart - 1;
  function addImage(context, imageSet) {
    const image = new Image();
    image.src = imageSet.src;
    image.onload = () => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i;
      const size2 = Math.floor(modules * moduleSize / 5);
      const position = size2 * 2 + space.margin + space.padding;
      if (!imageSet.overlap) rectangleCanvas(context, {
        height: (_a2 = imageSet.height) != null ? _a2 : size2,
        width: (_b2 = imageSet.width) != null ? _b2 : size2,
        positionX: (_c2 = imageSet.positionX) != null ? _c2 : position,
        positionY: (_d2 = imageSet.positionY) != null ? _d2 : position,
        fill: (_e2 = props.bgColor) != null ? _e2 : "#FFF"
      });
      context.drawImage(
        image,
        (_f2 = imageSet.positionX) != null ? _f2 : position,
        (_g2 = imageSet.positionY) != null ? _g2 : position,
        (_h2 = imageSet.width) != null ? _h2 : size2,
        (_i = imageSet.height) != null ? _i : size2
      );
    };
  }
  useEffect(() => {
    var _a2, _b2;
    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, space.total + size, space.total + size);
    rectangleCanvas(context, {
      height: space.padding * 2 + size,
      width: space.padding * 2 + size,
      positionX: space.margin,
      positionY: space.margin,
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
          positionX: col * moduleSize + space.margin + space.padding,
          positionY: row * moduleSize + space.margin + space.padding,
          height: moduleSize,
          width: moduleSize,
          fill: getColor(color[key], colorEffect[key], col, row),
          ...changer
        });
      }
    }
    if (imagem) addImage(context, imagem);
    if (typeof props.onReady === "function") {
      props.onReady(canvas.current);
    }
  }, [props]);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ...props.internalProps,
      ref: canvas,
      width: size + space.total,
      height: size + space.total,
      children: props.children
    }
  );
}
var QrcodeCanvas_default = QrcodeCanvas;

// src/QrcodeSVG.tsx
import qrcodeGenerator2 from "qrcode-generator";
import React, { useEffect as useEffect2, useRef as useRef2 } from "react";

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
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
function QrcodeSvg(props) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const SVG = useRef2(null);
  const qrcode = qrcodeGenerator2((_a = props.modules) != null ? _a : 0, (_b = props.level) != null ? _b : props.image ? "H" : "M");
  qrcode.addData((_c = props.value) != null ? _c : "", props.mode);
  qrcode.make();
  const modules = qrcode.getModuleCount();
  const rawModuleSize = ((_d = props.size) != null ? _d : modules * 10) / modules;
  const moduleSize = Math.floor(rawModuleSize);
  const size = moduleSize * modules;
  const space = {
    margin: Math.floor((_e = props.margin) != null ? _e : 0),
    padding: Math.floor((_f = props.padding) != null ? _f : 0),
    total: (Math.floor((_g = props.margin) != null ? _g : 0) + Math.floor((_h = props.padding) != null ? _h : 0)) * 2
  };
  const variant = qrCodePartNormalize("standard", props.variant);
  const color = qrCodePartNormalize("#000", props.color);
  const colorEffect = qrCodePartNormalize("none", props.colorEffect);
  const Image2 = () => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2;
    const image = qrCodeImageNormalize(props.image);
    const size2 = Math.floor(modules * moduleSize / 5);
    const position = size2 * 2 + space.margin + space.padding;
    const [src, setSrc] = React.useState();
    useEffect2(() => {
      if (src || !image) return;
      loadImageAsBase64(image.src).then(setSrc);
    }, [image, src]);
    if (!src || !image) return /* @__PURE__ */ jsx2(Fragment, {});
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      image.overlap ? /* @__PURE__ */ jsx2(Fragment, {}) : /* @__PURE__ */ jsx2(
        "rect",
        {
          width: (_a2 = image.width) != null ? _a2 : size2,
          height: (_b2 = image.height) != null ? _b2 : size2,
          x: (_c2 = image.positionX) != null ? _c2 : position,
          y: (_d2 = image.positionY) != null ? _d2 : position,
          fill: (_e2 = props.bgColor) != null ? _e2 : "#FFF"
        }
      ),
      /* @__PURE__ */ jsx2(
        "image",
        {
          href: src,
          width: (_f2 = image.width) != null ? _f2 : size2,
          height: (_g2 = image.height) != null ? _g2 : size2,
          x: (_h2 = image.positionX) != null ? _h2 : position,
          y: (_i2 = image.positionY) != null ? _i2 : position,
          preserveAspectRatio: "xMidYMid meet"
        }
      )
    ] });
  };
  const rects = [];
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qrcode.isDark(row, col)) continue;
      const key = col < 7 && row < 7 || col < 7 && row >= modules - 7 || col >= modules - 7 && row < 7 ? "eyes" : "body";
      const x = col * moduleSize + space.margin + space.padding;
      const y = row * moduleSize + space.margin + space.padding;
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
        /* @__PURE__ */ jsx2(
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
            stroke: props.divider && key === "body" ? (_i = props.bgColor) != null ? _i : "#FFF" : void 0
          },
          `${row}-${col}`
        )
      );
    }
  }
  useEffect2(() => {
    if (typeof props.onReady === "function" && SVG.current) {
      props.onReady(SVG.current);
    }
  }, [props, SVG]);
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      shapeRendering: "geometricPrecision",
      ...props.internalProps,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${size + space.total} ${size + space.total}`,
      width: size + space.total,
      height: size + space.total,
      ref: SVG,
      children: [
        /* @__PURE__ */ jsx2(
          "rect",
          {
            x: space.margin,
            y: space.margin,
            width: size + space.padding * 2,
            height: size + space.padding * 2,
            fill: (_j = props.bgColor) != null ? _j : "#FFF",
            rx: props.bgRounded ? 10 : 0
          }
        ),
        rects,
        /* @__PURE__ */ jsx2(Image2, {})
      ]
    }
  );
}
var QrcodeSVG_default = QrcodeSvg;

// src/index.ts
function useQrcodeDownload(suffix = "") {
  const [qrcode, setQrcode] = useState(null);
  const isCanvas = qrcode instanceof HTMLCanvasElement;
  return [
    setQrcode,
    (fileName) => {
      if (qrcode) download(
        isCanvas ? qrcode.toDataURL("image/png") : new Blob([qrcode.outerHTML], { type: "image/svg+xml;charset=utf-8" }),
        fileName + suffix + (isCanvas ? ".png" : ".svg"),
        isCanvas ? "image/png" : "image/svg+xml"
      );
    },
    qrcode !== null
  ];
}
export {
  QrcodeCanvas_default as QrcodeCanvas,
  QrcodeSVG_default as QrcodeSVG,
  useQrcodeDownload
};
//# sourceMappingURL=index.mjs.map