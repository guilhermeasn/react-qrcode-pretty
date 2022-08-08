import { useEffect, useRef } from 'react';
import qrcodeGenerator from 'qrcode-generator';
import canvasRectangle, { CanvasRectangleProps } from './canvasRectangle';

type QrCodeProps = {
    value    : string;
    size    ?: number;
    color   ?: string | CanvasGradient | CanvasPattern;
    level   ?: ErrorCorrectionLevel;
    margin  ?: number;
    variant ?: QrCodeStyle | QrCodePart;
    divider ?: boolean;
    bgColor ?: string;
}

type QrCodePart = {
    eye  : QrCodeStyle;
    body : QrCodeStyle
}

type QrCodeStyle = (
    'standard' |
    'dots'     |
    'fluid'
);

export default function QrCodeCanvas(props : QrCodeProps) {

    const canvas : React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const variant : QrCodePart = typeof props.variant === 'object' ? props.variant : {
        eye:  props.variant ?? 'standard',
        body: props.variant ?? 'standard'
    };

    const qrcode : QRCode = qrcodeGenerator(0, props.level ?? 'M');
    qrcode.addData(props.value);
    qrcode.make();

    const modules : number = qrcode.getModuleCount();
    const size : number = props.size ?? modules * 10;

    const moduleSize     : number = size / modules;
    const moduleEyeStart : number = 7;
    const moduleEyeEnd   : number = modules - moduleEyeStart - 1;
    
    useEffect(() => {

        if(!canvas.current) return;

        const context = canvas.current.getContext('2d');
        if(!context) return;

        for(let row = 0; row < modules; row++) {

            for(let col = 0; col < modules; col++) {

                if(!qrcode.isDark(row, col)) continue;

                let key : keyof QrCodePart = (col < moduleEyeStart && row < moduleEyeStart) ||
                                             (col < moduleEyeStart && row > moduleEyeEnd)   || 
                                             (col > moduleEyeEnd && row < moduleEyeStart)
                                             ? 'eye' : 'body';

                let changer : Partial<CanvasRectangleProps> = {
                    stroke: key === 'body' && props.divider ? (props.bgColor ?? '#FFF') : null
                };

                let radius = moduleSize / 1.5;

                switch(variant[key]) {

                    case 'dots':
                        changer.radius = radius;
                        break;

                    case 'fluid':

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
                        
                        changer.radius = {
                            top_right:    !isDark.col.after  && !isDark.row.before ? radius : 0,
                            top_left:     !isDark.col.before && !isDark.row.before ? radius : 0,
                            bottom_right: !isDark.col.after  && !isDark.row.after  ? radius : 0,
                            bottom_left:  !isDark.col.before && !isDark.row.after  ? radius : 0
                        }
                        
                        break;
            
                }                
                
                canvasRectangle({
                    canvas2d: context,
                    positionX: col * moduleSize,
                    positionY: row * moduleSize,
                    height: moduleSize,
                    width: moduleSize,
                    fill: props.color ?? '#000',
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