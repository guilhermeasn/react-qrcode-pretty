import React, { useEffect, useRef } from 'react';
import qrcodeGenerator from 'qrcode-generator';
import canvasRectangle from './canvasRectangle';
/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCodeCanvas(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const canvas = useRef(null);
    const space = {
        margin: (_a = props.margin) !== null && _a !== void 0 ? _a : 0,
        padding: (_b = props.padding) !== null && _b !== void 0 ? _b : 0,
        total: (((_c = props.margin) !== null && _c !== void 0 ? _c : 0) + ((_d = props.padding) !== null && _d !== void 0 ? _d : 0)) * 2
    };
    const variant = (typeof props.variant === 'object'
        && 'eyes' in props.variant
        && 'body' in props.variant) ? props.variant : {
        eyes: (_e = props.variant) !== null && _e !== void 0 ? _e : 'standard',
        body: (_f = props.variant) !== null && _f !== void 0 ? _f : 'standard'
    };
    const color = (typeof props.color === 'object'
        && 'eyes' in props.color
        && 'body' in props.color) ? props.color : {
        eyes: (_g = props.color) !== null && _g !== void 0 ? _g : '#000',
        body: (_h = props.color) !== null && _h !== void 0 ? _h : '#000'
    };
    const qrcode = qrcodeGenerator((_j = props.modules) !== null && _j !== void 0 ? _j : 0, (_k = props.level) !== null && _k !== void 0 ? _k : (props.image && props.imageBig ? 'H' : 'M'));
    qrcode.addData((_l = props.value) !== null && _l !== void 0 ? _l : '', props.mode);
    qrcode.make();
    const modules = qrcode.getModuleCount();
    const size = (_m = props.size) !== null && _m !== void 0 ? _m : modules * 10;
    const moduleSize = size / modules;
    const moduleEyeStart = 7;
    const moduleEyeEnd = modules - moduleEyeStart - 1;
    function addImage(context, src, clear, big) {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            var _a;
            const size = Math.floor(modules * moduleSize / (big ? 4 : 5));
            const position = size * (big ? 1.5 : 2) + space.margin + space.padding;
            if (clear)
                canvasRectangle({
                    canvas2d: context,
                    height: size,
                    width: size,
                    positionX: position,
                    positionY: position,
                    fill: (_a = props.bgColor) !== null && _a !== void 0 ? _a : '#FFF',
                });
            context.drawImage(image, position, position, size, size);
        };
    }
    useEffect(() => {
        var _a, _b, _c;
        if (!canvas.current)
            return;
        const context = canvas.current.getContext('2d');
        if (!context)
            return;
        context.clearRect(0, 0, space.total + size, space.total + size);
        canvasRectangle({
            canvas2d: context,
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
                let key = (col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd) ||
                    (col > moduleEyeEnd && row < moduleEyeStart)
                    ? 'eyes' : 'body';
                let changer = {
                    stroke: key === 'body' && props.divider ? ((_b = props.bgColor) !== null && _b !== void 0 ? _b : '#FFF') : null
                };
                const radius = moduleSize / 1.6;
                const isDark = {
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
                        const half = Math.floor(modules / 2);
                        changer.radius = {
                            top_right: !isDark.col.after && !isDark.row.before && !(row > half && col < half) ? radius : 0,
                            top_left: !isDark.col.before && !isDark.row.before && !(row > half && col > half) ? radius : 0,
                            bottom_right: !isDark.col.after && !isDark.row.after && !(row < half && col < half) ? radius : 0,
                            bottom_left: !isDark.col.before && !isDark.row.after && !(row < half && col > half) ? radius : 0
                        };
                        break;
                }
                canvasRectangle(Object.assign({ canvas2d: context, positionX: col * moduleSize + space.margin + space.padding, positionY: row * moduleSize + space.margin + space.padding, height: moduleSize, width: moduleSize, fill: color[key] }, changer));
            }
        }
        if (props.image)
            addImage(context, props.image, !props.overlap, (_c = props.imageBig) !== null && _c !== void 0 ? _c : false);
        if (typeof props.onReady === 'function') {
            props.onReady(canvas.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    return React.createElement("canvas", Object.assign({}, (_o = props.canvasProps) !== null && _o !== void 0 ? _o : {}, { style: props.resize ? Object.assign(Object.assign({}, ((_q = (_p = props.canvasProps) === null || _p === void 0 ? void 0 : _p.style) !== null && _q !== void 0 ? _q : {})), { width: props.resize, height: props.resize }) : (_r = props.canvasProps) === null || _r === void 0 ? void 0 : _r.style, ref: canvas, width: size + space.total, height: size + space.total }), props.children);
}
