import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';
import canvasRectangle from './rectangleCanvas';
import { getColor, qrCodeImageNormalize, qrCodePartNormalize, qrCodeStyleRadius } from './helpers';
/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrcodeCanvas(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const canvas = useRef(null);
    const space = {
        margin: (_a = props.margin) !== null && _a !== void 0 ? _a : 0,
        padding: (_b = props.padding) !== null && _b !== void 0 ? _b : 0,
        total: (((_c = props.margin) !== null && _c !== void 0 ? _c : 0) + ((_d = props.padding) !== null && _d !== void 0 ? _d : 0)) * 2
    };
    const variant = qrCodePartNormalize('standard', props.variant);
    const color = qrCodePartNormalize('#000', props.color);
    const colorEffect = qrCodePartNormalize('none', props.colorEffect);
    const imagem = qrCodeImageNormalize(props.image);
    const qrcode = qrcodeGenerator((_e = props.modules) !== null && _e !== void 0 ? _e : 0, ((_f = props.level) !== null && _f !== void 0 ? _f : props.image) ? 'H' : 'M');
    qrcode.addData((_g = props.value) !== null && _g !== void 0 ? _g : '', props.mode);
    qrcode.make();
    const modules = qrcode.getModuleCount();
    const size = (_h = props.size) !== null && _h !== void 0 ? _h : modules * 10;
    const moduleSize = size / modules;
    const moduleEyeStart = 7;
    const moduleEyeEnd = modules - moduleEyeStart - 1;
    function addImage(context, imageSet) {
        const image = new Image();
        image.src = imageSet.src;
        image.onload = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const size = Math.floor(modules * moduleSize / 5);
            const position = size * 2 + space.margin + space.padding;
            if (!imageSet.overlap)
                canvasRectangle(context, {
                    height: (_a = imageSet.height) !== null && _a !== void 0 ? _a : size,
                    width: (_b = imageSet.width) !== null && _b !== void 0 ? _b : size,
                    positionX: (_c = imageSet.positionX) !== null && _c !== void 0 ? _c : position,
                    positionY: (_d = imageSet.positionY) !== null && _d !== void 0 ? _d : position,
                    fill: (_e = props.bgColor) !== null && _e !== void 0 ? _e : '#FFF',
                });
            context.drawImage(image, (_f = imageSet.positionX) !== null && _f !== void 0 ? _f : position, (_g = imageSet.positionY) !== null && _g !== void 0 ? _g : position, (_h = imageSet.width) !== null && _h !== void 0 ? _h : size, (_j = imageSet.height) !== null && _j !== void 0 ? _j : size);
        };
    }
    useEffect(() => {
        var _a, _b;
        if (!canvas.current)
            return;
        const context = canvas.current.getContext('2d');
        if (!context)
            return;
        context.clearRect(0, 0, space.total + size, space.total + size);
        canvasRectangle(context, {
            height: space.padding * 2 + size,
            width: space.padding * 2 + size,
            positionX: space.margin,
            positionY: space.margin,
            fill: (_a = props.bgColor) !== null && _a !== void 0 ? _a : '#FFF',
            radius: props.bgRounded ? 10 : undefined
        });
        for (let row = 0; row < modules; row++) {
            for (let col = 0; col < modules; col++) {
                if (!qrcode.isDark(row, col))
                    continue;
                let key = ((col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd) ||
                    (col > moduleEyeEnd && row < moduleEyeStart)) ? 'eyes' : 'body';
                let changer = {
                    stroke: key === 'body' && props.divider ? ((_b = props.bgColor) !== null && _b !== void 0 ? _b : '#FFF') : null
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
                changer.radius = typeof variant[key] === 'function'
                    ? variant[key](key, moduleSize, modules, wrapped, row, col)
                    : qrCodeStyleRadius(variant[key], moduleSize, modules, wrapped, row, col, key);
                canvasRectangle(context, Object.assign({ positionX: col * moduleSize + space.margin + space.padding, positionY: row * moduleSize + space.margin + space.padding, height: moduleSize, width: moduleSize, fill: getColor(color[key], colorEffect[key], col, row) }, changer));
            }
        }
        if (imagem)
            addImage(context, imagem);
        if (typeof props.onReady === 'function') {
            props.onReady(canvas.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    return React.createElement("canvas", Object.assign({}, props.internalProps, { ref: canvas, width: size + space.total, height: size + space.total }), props.children);
}
