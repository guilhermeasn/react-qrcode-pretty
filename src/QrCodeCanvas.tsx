import { useEffect, useRef } from 'react';
import qrcodeGenerator from 'qrcode-generator';
import canvasRectangle, { CanvasRectangleProps } from './canvasRectangle';

type QrCodeProps = {
    value    : string;
    size    ?: number;
    color   ?: QrCodeColor | QrCodePart<QrCodeColor>;
    level   ?: ErrorCorrectionLevel;
    margin  ?: number;
    variant ?: QrCodeStyle | QrCodePart<QrCodeStyle>;
    divider ?: boolean;
    bgColor ?: string;
}

type QrCodeColor = string | CanvasGradient | CanvasPattern;

type QrCodePart<T> = {
    eye  : T;
    body : T;
}

type QrCodeStyle = (
    'standard' |
    'dots'     |
    'fluid'    |
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

    const qrcode : QRCode = qrcodeGenerator(0, props.level ?? 'M');
    qrcode.addData(props.value);
    qrcode.make();

    const modules : number = qrcode.getModuleCount();
    const size : number = props.size ?? modules * 10;

    const moduleSize     : number = size / modules;
    const moduleEyeStart : number = 7;
    const moduleEyeEnd   : number = modules - moduleEyeStart - 2;
    
    useEffect(() => {

        if(!canvas.current) return;

        const context = canvas.current.getContext('2d');
        if(!context) return;

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

                const radius = moduleSize / 1.5;

                const isDark = {
                    row: {
                        after: row > 0 ? qrcode.isDark(row - 1, col) : false,
                        before: row < modules - 1 ? qrcode.isDark(row + 1, col) : false
                    },
                    col: {
                        after: col > 0 ? qrcode.isDark(row, col - 1) : false,
                        before: col < modules - 1 ? qrcode.isDark(row, col + 1) : false
                    }
                }

                switch(variant[key]) {

                    case 'dots':
                        changer.radius = radius;
                        break;

                    case 'fluid':
                        changer.radius = {
                            top_right:    !isDark.col.before  && !isDark.row.after  ? radius : 0,
                            top_left:     !isDark.col.after   && !isDark.row.after  ? radius : 0,
                            bottom_right: !isDark.col.before  && !isDark.row.before ? radius : 0,
                            bottom_left:  !isDark.col.after   && !isDark.row.before ? radius : 0
                        };
                        break;

                    case 'morse':
                        changer.radius = !isDark.col.after  && !isDark.col.before ? radius : {
                            top_left:     !isDark.col.after ? radius : 0,
                            bottom_left:  !isDark.col.after ? radius : 0,
                            top_right:    !isDark.col.before ? radius : 0,
                            bottom_right: !isDark.col.before ? radius : 0
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props ]);

    return <canvas
        ref={ canvas }
        width={ size }
        height={ size }
        style={ {
            padding: props.margin,
            backgroundColor: props.bgColor ?? '#FFF'
        } }
    />;

}