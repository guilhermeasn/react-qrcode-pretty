import qrcodeGenerator from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';
import type { CanvasRectangleProps } from './canvasRectangle';
import canvasRectangle from './canvasRectangle';

type ModeNumber =
  | 0 // Automatic type number
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40
  ;

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Props of the QrCode Component
 */
export type QrCodeProps = {

    /**
     * Qrcode payload (required)
     */
    value : string;

    /**
     * Size of the qrcode without margin and padding
     */
    size ?: number;

    /**
     * Resize ready qrcode with CSS
     */
     resize ?: number;

    /**
     * Foreground color for the entire qrcode or for each part (eyes and body) of the qrcode
     */
    color ?: QrCodeColor | QrCodePart<QrCodeColor>;

    /**
     * Mode that payload (value) will be logged
     */
    mode ?: Mode;

    /**
     * Error correction level
     * - Level L - up to 7% damage
     * - Level M - up to 15% damage
     * - Level Q - up to 25% damage
     * - Level H - up to 30% damage
     */
    level ?: ErrorCorrectionLevel;

    /**
     * Number of qrcode modules
     * - 0 is auto
     */
    modules ?: ModeNumber;

    /**
     * Location (src) of an image to be inserted into the center of the qrcode
     */
    image ?: string;

    /**
     * Imagem a ser exibida em tamanho grande
     */
    imageBig ?: boolean;

    /**
     * For the image to overlay the qrcode without cropping it
     */
    overlap ?: boolean;

    /**
     * Margin size. Area without background color
     */
    margin ?: number;

    /**
     * Padding size. Area with background color
     */
    padding ?: number;

    /**
     * Style applied to the entire qrcode or each part (eyes and body) of it
     */
    variant ?: QrCodeStyle | QrCodePart<QrCodeStyle>;

    /**
     * Active a small separation between the qrcode body points
     */
    divider ?: boolean;

    /**
     * Background color
     */
    bgColor ?: string;

    /**
     * Background color rounded
     */
    bgRounded ?: boolean;

    /**
     * The canvas tag children
     */
    children ?: React.ReactNode;

    /**
     * The canvas attributes
     */
    canvasProps ?: React.HTMLAttributes<HTMLCanvasElement>;

    /**
     * Provides canvas properties and methods when available.
     */
    onReady ?: (canvas : HTMLCanvasElement) => void

}

/**
 * Color string
 */
export type QrCodeColor = string;

/**
 * Qrcode Parts (eyes and body)
 */
export type QrCodePart<T> = {
    eyes : T;
    body : T;
}

/**
 * Style variations for qrcode parts
 */
export type QrCodeStyle = (
    'standard' |
    'rounded'  |
    'dots'     |
    'circle'   |
    'fluid'    |
    'reverse'  |
    'shower'   |
    'gravity'  |
    'morse'
);

/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCodeCanvas(props : QrCodeProps) : JSX.Element {

    const canvas : React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
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

    const qrcode : QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? (props.image && props.imageBig ? 'H' : 'M'));
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

        if(!canvas.current) return;

        const context = canvas.current.getContext('2d');
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

        for(let row = 0; row < modules; row++) {

            for(let col = 0; col < modules; col++) {

                if(!qrcode.isDark(row, col)) continue;

                let key : keyof QrCodePart<any> = (col < moduleEyeStart && row < moduleEyeStart) ||
                                                  (col < moduleEyeStart && row > moduleEyeEnd)   || 
                                                  (col > moduleEyeEnd && row < moduleEyeStart)
                                                  ? 'eyes' : 'body';

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
                
                canvasRectangle({
                    canvas2d: context,
                    positionX: col * moduleSize + space.margin + space.padding,
                    positionY: row * moduleSize + space.margin + space.padding,
                    height: moduleSize,
                    width: moduleSize,
                    fill: color[key],
                    ...changer
                });

            }

        }

        if(props.image) addImage(
            context,
            props.image,
            !props.overlap,
            props.imageBig ?? false
        );

        if(typeof props.onReady === 'function') {
            props.onReady(canvas.current);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props ]);

    return <canvas
        { ...props.canvasProps ?? {} }
        style={ props.resize ? {
            ...(props.canvasProps?.style ?? {}),
            width: props.resize,
            height: props.resize
        } : props.canvasProps?.style }
        ref={ canvas }
        width={ size + space.total }
        height={ size + space.total }
    >{ props.children }</canvas>;

}
