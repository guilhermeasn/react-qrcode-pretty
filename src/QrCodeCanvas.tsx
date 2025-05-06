import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';
import canvasRectangle from './canvasRectangle';
import { colorGradient, getRandomColor, qrCodePartNormalize } from './helpers';
import type { QrCodeCanvasProps, QrCodeColor, QrCodeColorEffect, QrCodePartOption, QrCodeRadius, QrCodeRectangleProps, QrCodeRenderElement, QrCodeStyle, QrCodeWrapped } from './types';

/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCodeCanvas(props : QrCodeCanvasProps) {

    const element : React.RefObject<QrCodeRenderElement<E>> = useRef<QrCodeRenderElement<E>>(null);

    const space = {
        margin: props.margin ?? 0,
        padding: props.padding ?? 0,
        total: ((props.margin ?? 0) + (props.padding ?? 0)) * 2
    }

    const variant = qrCodePartNormalize<QrCodeStyle>('standard', props.variant);
    const color = qrCodePartNormalize<QrCodeColor>('#000', props.color);
    const colorEffect = qrCodePartNormalize<QrCodeColorEffect>('none', props.colorEffect);

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
            if(clear) canvasRectangle(context, {
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

            canvasRectangle(context, {
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

                let changer : Partial<QrCodeRectangleProps> = {
                    stroke: key === 'body' && props.divider ? (props.bgColor ?? '#FFF') : null
                };

                const wrapped : QrCodeWrapped = {
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
                    col
                );
                

                if(element.current instanceof HTMLCanvasElement && context) {
                    canvasRectangle(context, {
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

function qrCodeStyleRadius(
    variant : QrCodeStyle,
    moduleSize : number,
    modules: number,
    wrapped : QrCodeWrapped,
    row: number,
    col: number
) : QrCodeRadius {

    const radius = moduleSize / 1.6;

    switch(variant) {

        case 'dots': return radius;

        case 'rounded': return moduleSize / 2;

        case 'circle': return {
            top_left:     !wrapped.col.before && !wrapped.row.before && wrapped.col.after && wrapped.row.after ? moduleSize * 1.5 : 0,
            top_right:    wrapped.col.before && !wrapped.row.before && !wrapped.col.after && wrapped.row.after ? moduleSize * 1.5 : 0,
            bottom_left:  !wrapped.col.before && wrapped.row.before && wrapped.col.after && !wrapped.row.after ? moduleSize * 1.5 : 0,
            bottom_right: wrapped.col.before && wrapped.row.before && !wrapped.col.after && !wrapped.row.after ? moduleSize * 1.5 : 0
        };
        
        case 'fluid': return {
            top_right:    !wrapped.col.after  && !wrapped.row.before ? radius : 0,
            top_left:     !wrapped.col.before && !wrapped.row.before ? radius : 0,
            bottom_right: !wrapped.col.after  && !wrapped.row.after  ? radius : 0,
            bottom_left:  !wrapped.col.before && !wrapped.row.after  ? radius : 0
        };

        case 'reverse': return {
            top_right:    wrapped.col.after  && wrapped.row.before ? radius : 0,
            top_left:     wrapped.col.before && wrapped.row.before ? radius : 0,
            bottom_right: wrapped.col.after  && wrapped.row.after  ? radius : 0,
            bottom_left:  wrapped.col.before && wrapped.row.after  ? radius : 0
        };
            

        case 'morse': return !wrapped.col.before && !wrapped.col.after ? radius : {
            top_left:     !wrapped.col.before ? radius : 0,
            bottom_left:  !wrapped.col.before ? radius : 0,
            top_right:    !wrapped.col.after  ? radius : 0,
            bottom_right: !wrapped.col.after  ? radius : 0
        };

        
        case 'shower': return !wrapped.row.before && !wrapped.row.after ? radius : {
            top_left:     !wrapped.row.before ? radius : 0,
            top_right:    !wrapped.row.before ? radius : 0,
            bottom_left:  !wrapped.row.after  ? radius : 0,
            bottom_right: !wrapped.row.after  ? radius : 0
        };

        case 'gravity':
            const half = Math.floor(modules / 2);
            return {
                top_right:    !wrapped.col.after  && !wrapped.row.before && !(row > half && col < half) ? radius : 0,
                top_left:     !wrapped.col.before && !wrapped.row.before && !(row > half && col > half) ? radius : 0,
                bottom_right: !wrapped.col.after  && !wrapped.row.after  && !(row < half && col < half) ? radius : 0,
                bottom_left:  !wrapped.col.before && !wrapped.row.after  && !(row < half && col > half) ? radius : 0
            };

        default: return 0;

    }

}
