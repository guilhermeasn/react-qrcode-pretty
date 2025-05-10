import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';

import canvasRectangle from './rectangleCanvas';

import {
    getColor,
    qrCodeImageNormalize,
    qrCodePartNormalize,
    qrCodeStyleRadius
} from './helpers';

import type {
    QrcodeColor,
    QrcodeColorEffect,
    QrcodeCustomStyle,
    QrcodeImageSettings,
    QrcodePartOption,
    QrcodeProps,
    QrcodeRectangleProps,
    QrcodeStyle,
    QrcodeWrapped
} from './types';

/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrcodeCanvas(props : QrcodeProps<'canvas'>) : JSX.Element {

    const canvas : React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

    const space = {
        margin: props.margin ?? 0,
        padding: props.padding ?? 0,
        total: ((props.margin ?? 0) + (props.padding ?? 0)) * 2
    }

    const variant = qrCodePartNormalize<QrcodeStyle | QrcodeCustomStyle>('standard', props.variant);
    const color = qrCodePartNormalize<QrcodeColor>('#000', props.color);
    const colorEffect = qrCodePartNormalize<QrcodeColorEffect>('none', props.colorEffect);
    const imagem = qrCodeImageNormalize(props.image);

    const qrcode : QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? props.image ? 'H' : 'M');
    qrcode.addData(props.value ?? '', props.mode);
    qrcode.make();

    const modules : number = qrcode.getModuleCount();
    const size : number = props.size ?? modules * 10;

    const moduleSize     : number = size / modules;
    const moduleEyeStart : number = 7;
    const moduleEyeEnd   : number = modules - moduleEyeStart - 1;

    function addImage(context : CanvasRenderingContext2D, imageSet : QrcodeImageSettings) {
        const image = new Image();
        image.src = imageSet.src;
        image.onload = () => {
            const size = Math.floor(modules * moduleSize / 5);
            const position = size * 2 + space.margin + space.padding;
            if(!imageSet.overlap) canvasRectangle(context, {
                height: imageSet.height ?? size,
                width: imageSet.width ?? size,
                positionX: imageSet.positionX ?? position,
                positionY: imageSet.positionY ?? position,
                fill: props.bgColor ?? '#FFF',
            });
            context.drawImage(
                image,
                imageSet.positionX ?? position,
                imageSet.positionY ?? position,
                imageSet.width ?? size,
                imageSet.height ?? size
            );
        }
    }
    
    useEffect(() => {

        if(!canvas.current) return;

        const context = canvas.current.getContext('2d');
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

        for(let row = 0; row < modules; row++) {

            for(let col = 0; col < modules; col++) {

                if(!qrcode.isDark(row, col)) continue;

                let key : QrcodePartOption = (
                    (col < moduleEyeStart && row < moduleEyeStart) ||
                    (col < moduleEyeStart && row > moduleEyeEnd)   || 
                    (col > moduleEyeEnd && row < moduleEyeStart)
                ) ? 'eyes' : 'body';

                let changer : Partial<QrcodeRectangleProps> = {
                    stroke: key === 'body' && props.divider ? (props.bgColor ?? '#FFF') : null
                };

                const wrapped : QrcodeWrapped = {
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
                    ? (variant[key] as QrcodeCustomStyle)(key, moduleSize, modules, wrapped, row, col)
                    : qrCodeStyleRadius((variant[key] as QrcodeStyle), moduleSize, modules, wrapped, row, col, key);
                
                canvasRectangle(context, {
                    positionX: col * moduleSize + space.margin + space.padding,
                    positionY: row * moduleSize + space.margin + space.padding,
                    height: moduleSize,
                    width: moduleSize,
                    fill: getColor(color[key], colorEffect[key], col, row),
                    ...changer
                });

            }

        }

        if(imagem) addImage(context, imagem);

        if(typeof props.onReady === 'function') {
            props.onReady(canvas.current);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props ]);

    return <canvas
        { ...props.internalProps }
        ref={ canvas }
        width={ size + space.total }
        height={ size + space.total }
    >{ props.children }</canvas>;

}
