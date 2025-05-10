import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';

import rectanglePath from './rectanglePath';

import {
    getColor,
    qrCodeImageNormalize,
    qrCodePartNormalize,
    qrCodeStyleRadius
} from './helpers';

import type {
    QrCodeColor,
    QrCodeColorEffect,
    QrCodeImageSettings,
    QrCodePartOption,
    QrCodeProps,
    QrCodeStyle,
    QrCodeWrapped
} from './types';

/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCodeSvg(props: QrCodeProps<'SVG'>): JSX.Element {

    const SVG : React.RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);

    const qrcode : QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? props.image ? 'H' : 'M');
    qrcode.addData(props.value ?? '', props.mode);
    qrcode.make();

    const modules = qrcode.getModuleCount();
    const size = props.size ?? modules * 10;
    const moduleSize = size / modules;

    const space = {
        margin: props.margin ?? 0,
        padding: props.padding ?? 0,
        total: ((props.margin ?? 0) + (props.padding ?? 0)) * 2
    };

    const variant = qrCodePartNormalize<QrCodeStyle>('standard', props.variant);
    const color = qrCodePartNormalize<QrCodeColor>('#000', props.color);
    const colorEffect = qrCodePartNormalize<QrCodeColorEffect>('none', props.colorEffect);

    const Image = () => {

        if(!props.image) return <></>;

        const image = qrCodeImageNormalize(props.image) as QrCodeImageSettings;
        const size = Math.floor(modules * moduleSize / 5);
        const position = size * 2 + space.margin + space.padding;

        return <>

            { image.overlap ? <></> : (
                <rect
                    width={image.width ?? size }
                    height={image.height ?? size }
                    x={ image.positionX ?? position }
                    y={ image.positionY ?? position }
                    fill={ props.bgColor ?? '#FFF' }
                />
            ) }

            <image
                href={ image.src }
                width={ image.width ?? size }
                height={ image.height ?? size }
                x={ image.positionX ?? position }
                y={ image.positionY ?? position }
                preserveAspectRatio="xMidYMid meet"
            />

        </>;

    }

    const rects: JSX.Element[] = [];

    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            if (!qrcode.isDark(row, col)) continue;

            const key: QrCodePartOption = (
                (col < 7 && row < 7) ||
                (col < 7 && row >= modules - 7) ||
                (col >= modules - 7 && row < 7)
            ) ? 'eyes' : 'body';

            const x = col * moduleSize + space.margin + space.padding;
            const y = row * moduleSize + space.margin + space.padding;
            const c = getColor(color[key], colorEffect[key], col, row);

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

            rects.push(
                <path
                    d={ rectanglePath({
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
                            col
                        )
                    }) }
                    key={ `${row}-${col}` }
                    fill={ c }
                    stroke={ props.divider && key === 'body' ? (props.bgColor ?? '#FFF') : undefined }
                />
            );
        }
    }

    useEffect(() => {
        if(typeof props.onReady === 'function' && SVG.current) {
            props.onReady(SVG.current);
        }
    }, [ props, SVG ]);

    return (
        <svg
            { ...props.internalProps }
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${size + space.total} ${size + space.total}`}
            width={size + space.total}
            height={size + space.total}
            ref={ SVG }
        >
            <rect
                x={space.margin}
                y={space.margin}
                width={size + space.padding * 2}
                height={size + space.padding * 2}
                fill={props.bgColor ?? '#FFF'}
                rx={props.bgRounded ? 10 : 0}
            />
            { rects }
            <Image />
        </svg>
    );
}
