import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';
import type { CanvasRectangleProps } from './canvasRectangle';
import canvasRectangle from './canvasRectangle';
import { colorGradient, getRandomColor } from './helpers';
import type { QrCodeColor, QrCodeColorEffect, QrCodePart, QrCodePartOption, QrCodeProps, QrCodeRenderAs, QrCodeRenderElement, QrCodeStyle } from './types';

/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCode<E extends QrCodeRenderAs = 'canvas'>(props : QrCodeProps<E>) {

    const renderAs : QrCodeRenderAs = props.renderAs ?? 'canvas';

    const element : React.RefObject<QrCodeRenderElement<E>> = useRef<QrCodeRenderElement<E>>(null);

    const space = {
        margin: props.margin ?? 0,
        padding: props.padding ?? 0,
        total: ((props.margin ?? 0) + (props.padding ?? 0)) * 2
    }

    const variant : QrCodePart<QrCodeStyle> = (
        typeof props.variant === 'object'
        && 'eyes' in props.variant
        && 'body' in props.variant
    ) ? props.variant : {
        eyes: props.variant ?? 'standard',
        body: props.variant ?? 'standard'
    };

    const color : QrCodePart<QrCodeColor> = (
        typeof props.color === 'object'
        && 'eyes' in props.color
        && 'body' in props.color
    ) ? props.color : {
        eyes: props.color ?? '#000',
        body: props.color ?? '#000'
    };

    const colorEffect : QrCodePart<QrCodeColorEffect> = (
        typeof props.colorEffect === 'object'
        && 'eyes' in props.colorEffect
        && 'body' in props.colorEffect
    ) ? props.colorEffect : {
        eyes: props.colorEffect ?? 'none',
        body: props.colorEffect ?? 'none'
    };

    const getColor = (key : QrCodePartOption, col: number, row: number) : QrCodeColor => {

        switch(colorEffect[key]) {

            case 'gradient-dark-vertical': return colorGradient(color[key], row * -3);
            case 'gradient-dark-horizontal': return colorGradient(color[key], col * -3);
            case 'gradient-dark-diagonal': return colorGradient(color[key], (col + row) * -2);
            case 'gradient-light-vertical': return colorGradient(color[key], row * 3);
            case 'gradient-light-horizontal': return colorGradient(color[key], col * 3);
            case 'gradient-light-diagonal': return colorGradient(color[key], (col + row) * 2);
            
            case 'colored': return getRandomColor(color[key]);

            default: return color[key];

        }

    }

    const qrcode : QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? props.image ? 'H' : 'M');
    qrcode.addData(props.value ?? '', props.mode);
    qrcode.make();

    const modules : number = qrcode.getModuleCount();
    const size : number = props.size ?? modules * 10;

    const moduleSize     : number = size / modules;
    const moduleEyeStart : number = 7;
    const moduleEyeEnd   : number = modules - moduleEyeStart - 1;

    function addImage(context : CanvasRenderingContext2D, src : string, clear : boolean, big : boolean) {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const size = Math.floor(modules * moduleSize / (big ? 4 : 5));
            const position = size * (big ? 1.5 : 2) + space.margin + space.padding;
            if(clear) canvasRectangle({
                canvas2d: context,
                height: size,
                width: size,
                positionX: position,
                positionY: position,
                fill: props.bgColor ?? '#FFF',
            });
            context.drawImage(image, position, position, size, size);
        }
    }
    
    useEffect(() => {

        if(!element.current) return;

        let context : CanvasRenderingContext2D | null = null;

        if(element.current instanceof HTMLCanvasElement) {

            context = element.current.getContext('2d');
            if(!context) return;

            context.clearRect(0, 0, space.total + size, space.total + size);

            canvasRectangle({
                canvas2d: context,
                height: space.padding * 2 + size,
                width: space.padding * 2 + size,
                positionX: space.margin,
                positionY: space.margin,
                fill: props.bgColor ?? '#FFF',
                radius: props.bgRounded ? 10 : undefined
            });

        }

        for(let row = 0; row < modules; row++) {

            for(let col = 0; col < modules; col++) {

                if(!qrcode.isDark(row, col)) continue;

                let key : QrCodePartOption = (
                    (col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd)   || 
                    (col > moduleEyeEnd && row < moduleEyeStart)
                ) ? 'eyes' : 'body';

                let changer : Partial<CanvasRectangleProps> = {
                    stroke: key === 'body' && props.divider ? (props.bgColor ?? '#FFF') : null
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

                switch(variant[key]) {

                    case 'dots':
                        changer.radius = radius;
                        break;

                    case 'rounded':
                        changer.radius = moduleSize / 2;
                        break;

                    case 'circle':
                        changer.radius = {
                            top_left:     !isDark.col.before && !isDark.row.before && isDark.col.after && isDark.row.after ? moduleSize * 1.5 : 0,
                            top_right:    isDark.col.before && !isDark.row.before && !isDark.col.after && isDark.row.after ? moduleSize * 1.5 : 0,
                            bottom_left:  !isDark.col.before && isDark.row.before && isDark.col.after && !isDark.row.after ? moduleSize * 1.5 : 0,
                            bottom_right: isDark.col.before && isDark.row.before && !isDark.col.after && !isDark.row.after ? moduleSize * 1.5 : 0
                        };
                        break;
                    
                    case 'fluid':
                        changer.radius = {
                            top_right:    !isDark.col.after  && !isDark.row.before ? radius : 0,
                            top_left:     !isDark.col.before && !isDark.row.before ? radius : 0,
                            bottom_right: !isDark.col.after  && !isDark.row.after  ? radius : 0,
                            bottom_left:  !isDark.col.before && !isDark.row.after  ? radius : 0
                        };
                        break;

                    case 'reverse':
                        changer.radius = {
                            top_right:    isDark.col.after  && isDark.row.before ? radius : 0,
                            top_left:     isDark.col.before && isDark.row.before ? radius : 0,
                            bottom_right: isDark.col.after  && isDark.row.after  ? radius : 0,
                            bottom_left:  isDark.col.before && isDark.row.after  ? radius : 0
                        };
                        break;

                    case 'morse':
                        changer.radius = !isDark.col.before && !isDark.col.after ? radius : {
                            top_left:     !isDark.col.before ? radius : 0,
                            bottom_left:  !isDark.col.before ? radius : 0,
                            top_right:    !isDark.col.after  ? radius : 0,
                            bottom_right: !isDark.col.after  ? radius : 0
                        };
                        break;

                    
                    case 'shower':
                        changer.radius = !isDark.row.before && !isDark.row.after ? radius : {
                            top_left:     !isDark.row.before ? radius : 0,
                            top_right:    !isDark.row.before ? radius : 0,
                            bottom_left:  !isDark.row.after  ? radius : 0,
                            bottom_right: !isDark.row.after  ? radius : 0
                        };
                        break;

                    case 'gravity':
                        const half = Math.floor(modules / 2);
                        changer.radius = {
                            top_right:    !isDark.col.after  && !isDark.row.before && !(row > half && col < half) ? radius : 0,
                            top_left:     !isDark.col.before && !isDark.row.before && !(row > half && col > half) ? radius : 0,
                            bottom_right: !isDark.col.after  && !isDark.row.after  && !(row < half && col < half) ? radius : 0,
                            bottom_left:  !isDark.col.before && !isDark.row.after  && !(row < half && col > half) ? radius : 0
                        };
                        break;
            
                }

                if(element.current instanceof HTMLCanvasElement && context) {
                    canvasRectangle({
                        canvas2d: context,
                        positionX: col * moduleSize + space.margin + space.padding,
                        positionY: row * moduleSize + space.margin + space.padding,
                        height: moduleSize,
                        width: moduleSize,
                        fill: getColor(key, col, row),
                        ...changer
                    });
                }

            }

        }

        // if(props.image) addImage(
        //     context,
        //     props.image,
        //     !props.overlap,
        //     props.imageBig ?? false
        // );

        if(typeof props.onReady === 'function') {
            props.onReady(element.current);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props ]);

    switch(renderAs) {

        case 'table': return (

            // FAZER
            <table
                { ...(props.internalProps as React.HTMLAttributes<HTMLTableElement>) ?? {} }
                ref={ element as React.RefObject<HTMLTableElement> }
            ></table>

        );

        case 'svg': return (

            // FAZER
            <svg
                { ...(props.internalProps as React.HTMLAttributes<SVGSVGElement>) ?? {} }
                ref={ element as React.RefObject<SVGSVGElement> }
            ></svg>

        );

        default: return (

            <canvas
                { ...(props.internalProps as React.HTMLAttributes<HTMLCanvasElement>) ?? {} }
                style={ props.resize ? {
                    ...(props.internalProps?.style ?? {}),
                    width: props.resize,
                    height: props.resize
                } : props.internalProps?.style }
                ref={ element as React.RefObject<HTMLCanvasElement> }
                width={ size + space.total }
                height={ size + space.total }
            ></canvas>

        );

    }

}
