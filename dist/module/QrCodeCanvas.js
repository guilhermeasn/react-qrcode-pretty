import React, { useEffect, useRef } from 'react';
import qrcodeGenerator from 'qrcode-generator';
import canvasRectangle from './canvasRectangle';
/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCodeCanvas(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const canvas = useRef(null);
    const variant = (typeof props.variant === 'object'
        && 'eyes' in props.variant
        && 'body' in props.variant) ? props.variant : {
        eyes: (_a = props.variant) !== null && _a !== void 0 ? _a : 'standard',
        body: (_b = props.variant) !== null && _b !== void 0 ? _b : 'standard'
    };
    const color = (typeof props.color === 'object'
        && 'eyes' in props.color
        && 'body' in props.color) ? props.color : {
        eyes: (_c = props.color) !== null && _c !== void 0 ? _c : '#000',
        body: (_d = props.color) !== null && _d !== void 0 ? _d : '#000'
    };
    const qrcode = qrcodeGenerator((_e = props.modules) !== null && _e !== void 0 ? _e : 0, (_f = props.level) !== null && _f !== void 0 ? _f : (props.imageBig ? 'Q' : 'M'));
    qrcode.addData(props.value, props.mode);
    qrcode.make();
    const modules = qrcode.getModuleCount();
    const size = (_g = props.size) !== null && _g !== void 0 ? _g : modules * 10;
    const moduleSize = size / modules;
    const moduleEyeStart = 7;
    const moduleEyeEnd = modules - moduleEyeStart - 1;
    function addImage(context, src, clear, big) {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const size = Math.floor(modules * moduleSize / (big ? 3 : 5));
            const position = size * (big ? 1 : 2);
            if (clear)
                context.clearRect(position, position, size, size);
            context.drawImage(image, position, position, size, size);
        };
    }
    useEffect(() => {
        var _a, _b;
        if (!canvas.current)
            return;
        const context = canvas.current.getContext('2d');
        if (!context)
            return;
        context.clearRect(0, 0, size, size);
        for (let row = 0; row < modules; row++) {
            for (let col = 0; col < modules; col++) {
                if (!qrcode.isDark(row, col))
                    continue;
                let key = (col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd) ||
                    (col > moduleEyeEnd && row < moduleEyeStart)
                    ? 'eyes' : 'body';
                let changer = {
                    stroke: key === 'body' && props.divider ? ((_a = props.bgColor) !== null && _a !== void 0 ? _a : '#FFF') : null
                };
                const radius = moduleSize / 1.4;
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
                        const half = Math.floor(modules / 2) + 1;
                        changer.radius = {
                            top_right: !isDark.col.after && !isDark.row.before && !(row > half && col < half) ? radius : 0,
                            top_left: !isDark.col.before && !isDark.row.before && !(row > half && col > half) ? radius : 0,
                            bottom_right: !isDark.col.after && !isDark.row.after && !(row < half && col < half) ? radius : 0,
                            bottom_left: !isDark.col.before && !isDark.row.after && !(row < half && col > half) ? radius : 0
                        };
                        break;
                }
                canvasRectangle(Object.assign({ canvas2d: context, positionX: col * moduleSize, positionY: row * moduleSize, height: moduleSize, width: moduleSize, fill: color[key] }, changer));
            }
        }
        if (props.image)
            addImage(context, props.image, !props.overlap, (_b = props.imageBig) !== null && _b !== void 0 ? _b : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    return React.createElement("canvas", { ref: canvas, width: size, height: size, style: Object.assign({ margin: props.margin, padding: props.padding, backgroundColor: (_h = props.bgColor) !== null && _h !== void 0 ? _h : '#FFF', borderRadius: props.bgRounded ? 10 : undefined }, ((_j = props.style) !== null && _j !== void 0 ? _j : {})), className: props.className }, props.children);
}
