import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';
import rectanglePath from './rectanglePath';
import { getColor, loadImageAsBase64, qrCodeImageNormalize, qrCodePartNormalize, qrCodeStyleRadius } from './helpers';
/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrcodeSvg(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const SVG = useRef(null);
    const qrcode = qrcodeGenerator((_a = props.modules) !== null && _a !== void 0 ? _a : 0, ((_b = props.level) !== null && _b !== void 0 ? _b : props.image) ? 'H' : 'M');
    qrcode.addData((_c = props.value) !== null && _c !== void 0 ? _c : '', props.mode);
    qrcode.make();
    const modules = qrcode.getModuleCount();
    const size = (_d = props.size) !== null && _d !== void 0 ? _d : modules * 10;
    const moduleSize = size / modules;
    const space = {
        margin: (_e = props.margin) !== null && _e !== void 0 ? _e : 0,
        padding: (_f = props.padding) !== null && _f !== void 0 ? _f : 0,
        total: (((_g = props.margin) !== null && _g !== void 0 ? _g : 0) + ((_h = props.padding) !== null && _h !== void 0 ? _h : 0)) * 2
    };
    const variant = qrCodePartNormalize('standard', props.variant);
    const color = qrCodePartNormalize('#000', props.color);
    const colorEffect = qrCodePartNormalize('none', props.colorEffect);
    const Image = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!props.image)
            return React.createElement(React.Fragment, null);
        const image = qrCodeImageNormalize(props.image);
        const size = Math.floor(modules * moduleSize / 5);
        const position = size * 2 + space.margin + space.padding;
        const [src, setSrc] = React.useState();
        useEffect(() => {
            if (src)
                return;
            loadImageAsBase64(image.src).then(setSrc);
        }, [props.image]);
        if (!src)
            return React.createElement(React.Fragment, null);
        return React.createElement(React.Fragment, null,
            image.overlap ? React.createElement(React.Fragment, null) : (React.createElement("rect", { width: (_a = image.width) !== null && _a !== void 0 ? _a : size, height: (_b = image.height) !== null && _b !== void 0 ? _b : size, x: (_c = image.positionX) !== null && _c !== void 0 ? _c : position, y: (_d = image.positionY) !== null && _d !== void 0 ? _d : position, fill: (_e = props.bgColor) !== null && _e !== void 0 ? _e : '#FFF' })),
            React.createElement("image", { href: src, width: (_f = image.width) !== null && _f !== void 0 ? _f : size, height: (_g = image.height) !== null && _g !== void 0 ? _g : size, x: (_h = image.positionX) !== null && _h !== void 0 ? _h : position, y: (_j = image.positionY) !== null && _j !== void 0 ? _j : position, preserveAspectRatio: "xMidYMid meet" }));
    };
    const rects = [];
    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            if (!qrcode.isDark(row, col))
                continue;
            const key = ((col < 7 && row < 7) ||
                (col < 7 && row >= modules - 7) ||
                (col >= modules - 7 && row < 7)) ? 'eyes' : 'body';
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
            rects.push(React.createElement("path", { d: rectanglePath({
                    height: moduleSize,
                    width: moduleSize,
                    positionX: x,
                    positionY: y,
                    radius: qrCodeStyleRadius(variant[key], moduleSize, modules, wrapped, row, col, key)
                }), key: `${row}-${col}`, fill: c, stroke: props.divider && key === 'body' ? ((_j = props.bgColor) !== null && _j !== void 0 ? _j : '#FFF') : undefined }));
        }
    }
    useEffect(() => {
        if (typeof props.onReady === 'function' && SVG.current) {
            props.onReady(SVG.current);
        }
    }, [props, SVG]);
    return (React.createElement("svg", Object.assign({}, props.internalProps, { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${size + space.total} ${size + space.total}`, width: size + space.total, height: size + space.total, ref: SVG }),
        React.createElement("rect", { x: space.margin, y: space.margin, width: size + space.padding * 2, height: size + space.padding * 2, fill: (_k = props.bgColor) !== null && _k !== void 0 ? _k : '#FFF', rx: props.bgRounded ? 10 : 0 }),
        rects,
        React.createElement(Image, null)));
}
