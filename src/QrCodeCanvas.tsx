import { useEffect, useRef } from 'react';
import qrcodeGenerator from 'qrcode-generator';
import canvasRectangle from './canvasRectangle';
import type { CanvasRectangleProps } from './canvasRectangle';

export type QrCodeProps = {
    value      : string;
    size      ?: number;
    color     ?: QrCodeColor | QrCodePart<QrCodeColor>;
    mode      ?: Mode;
    level     ?: ErrorCorrectionLevel;
    modules   ?: TypeNumber;
    image     ?: string;
    imageBig  ?: boolean;
    overlap   ?: boolean;
    margin    ?: number;
    padding   ?: number;
    variant   ?: QrCodeStyle | QrCodePart<QrCodeStyle>;
    divider   ?: boolean;
    bgColor   ?: string;
    bgRounded ?: boolean;
    className ?: string;
    children  ?: React.ReactNode;
    style     ?: React.CSSProperties;
}

export type QrCodeColor = string;

export type QrCodePart<T> = {
    eye  : T;
    body : T;
}

export type QrCodeStyle = (
    'standard' |
    'rounded'  |
    'dots'     |
    'fluid'    |
    'reverse'  |
    'shower'   |
    'gravity'  |
    'morse'
);

export default function QrCodeCanvas(props : QrCodeProps) {

    const canvas : React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

    const variant : QrCodePart<QrCodeStyle> = (
        typeof props.variant === 'object'
        && 'eye'  in props.variant
        && 'body' in props.variant
    ) ? props.variant : {
        eye:  props.variant ?? 'standard',
        body: props.variant ?? 'standard'
    };

    const color : QrCodePart<QrCodeColor> = (
        typeof props.color === 'object'
        && 'eye'  in props.color
        && 'body' in props.color
    ) ? props.color : {
        eye:  props.color ?? '#000',
        body: props.color ?? '#000'
    };

    const qrcode : QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? (props.imageBig ? 'Q' : 'M'));
    qrcode.addData(props.value, props.mode);
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
            const size = Math.floor(modules * moduleSize / (big ? 3 : 5));
            const position = size * (big ? 1 : 2);
            if(clear) context.clearRect(position, position, size, size);
            context.drawImage(image, position, position, size, size);
        }
    }
    
    useEffect(() => {

        if(!canvas.current) return;

        const context = canvas.current.getContext('2d');
        if(!context) return;

        context.clearRect(0, 0, size, size);

        for(let row = 0; row < modules; row++) {

            for(let col = 0; col < modules; col++) {

                if(!qrcode.isDark(row, col)) continue;

                let key : keyof QrCodePart<any> = (col < moduleEyeStart && row < moduleEyeStart) ||
                                                  (col < moduleEyeStart && row > moduleEyeEnd)   || 
                                                  (col > moduleEyeEnd && row < moduleEyeStart)
                                                  ? 'eye' : 'body';

                let changer : Partial<CanvasRectangleProps> = {
                    stroke: key === 'body' && props.divider ? (props.bgColor ?? '#FFF') : null
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
                }

                switch(variant[key]) {

                    case 'dots':
                        changer.radius = radius;
                        break;

                    case 'rounded':
                        changer.radius = moduleSize / 2;
                        break;
                    
                    case 'fluid':
                        changer.radius = {
                            top_right:    !isDark.col.after  && !isDark.row.before  ? radius : 0,
                            top_left:     !isDark.col.before   && !isDark.row.before  ? radius : 0,
                            bottom_right: !isDark.col.after  && !isDark.row.after ? radius : 0,
                            bottom_left:  !isDark.col.before   && !isDark.row.after ? radius : 0
                        };
                        break;

                    case 'reverse':
                        changer.radius = {
                            top_right:    isDark.col.after  && isDark.row.before  ? radius : 0,
                            top_left:     isDark.col.before   && isDark.row.before  ? radius : 0,
                            bottom_right: isDark.col.after  && isDark.row.after ? radius : 0,
                            bottom_left:  isDark.col.before   && isDark.row.after ? radius : 0
                        };
                        break;

                    case 'morse':
                        changer.radius = !isDark.col.before  && !isDark.col.after ? radius : {
                            top_left:     !isDark.col.before  ? radius : 0,
                            bottom_left:  !isDark.col.before  ? radius : 0,
                            top_right:    !isDark.col.after ? radius : 0,
                            bottom_right: !isDark.col.after ? radius : 0
                        };
                        break;

                    
                    case 'shower':
                        changer.radius = !isDark.row.before  && !isDark.row.after ? radius : {
                            top_left:     !isDark.row.before  ? radius : 0,
                            top_right:    !isDark.row.before  ? radius : 0,
                            bottom_left:  !isDark.row.after ? radius : 0,
                            bottom_right: !isDark.row.after ? radius : 0
                        };
                        break;

                    case 'gravity':
                        const half = Math.floor(modules / 2) + 1;
                        changer.radius = {
                            top_right:    !isDark.col.after  && !isDark.row.before  && !(row > half && col < half) ? radius : 0,
                            top_left:     !isDark.col.before   && !isDark.row.before  && !(row > half && col > half) ? radius : 0,
                            bottom_right: !isDark.col.after  && !isDark.row.after && !(row < half && col < half) ? radius : 0,
                            bottom_left:  !isDark.col.before   && !isDark.row.after && !(row < half && col > half) ? radius : 0
                        };
                        break;
            
                }                
                
                canvasRectangle({
                    canvas2d: context,
                    positionX: col * moduleSize,
                    positionY: row * moduleSize,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props ]);

    return <canvas
        ref={ canvas }
        width={ size }
        height={ size }
        style={ {
            margin: props.margin,
            padding: props.padding,
            backgroundColor: props.bgColor ?? '#FFF',
            borderRadius: props.bgRounded ? 10 : undefined,
            ...(props.style ?? {})
        } }
        className={ props.className }
    >{ props.children }</canvas>;

}