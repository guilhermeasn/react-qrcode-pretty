import qrcodeGenerator from 'qrcode-generator';
import { getColor, qrCodeImageNormalize, qrCodePartNormalize, qrCodeStyleRadius } from './helpers';
import rectanglePath from './rectanglePath';
import type { QrCodeColor, QrCodeColorEffect, QrCodePartOption, QrCodeProps, QrCodeStyle, QrCodeWrapped } from './types';

export default function QrCodeSvg(props: QrCodeProps<'SVG'>): JSX.Element {

    const qrcode = qrcodeGenerator(props.modules ?? 0, props.level ?? 'M');
    qrcode.addData(props.value ?? '', props.mode);
    qrcode.make();

    const variant = qrCodePartNormalize<QrCodeStyle>('standard', props.variant);
    const color = qrCodePartNormalize<QrCodeColor>('#000', props.color);
    const colorEffect = qrCodePartNormalize<QrCodeColorEffect>('none', props.colorEffect);
    const imagem = qrCodeImageNormalize(props.image);

    const modules = qrcode.getModuleCount();
    const size = props.size ?? modules * 10;
    const moduleSize = size / modules;

    const space = {
        margin: props.margin ?? 0,
        padding: props.padding ?? 0,
        total: ((props.margin ?? 0) + (props.padding ?? 0)) * 2
    };

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

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${size + space.total} ${size + space.total}`}
            { ...props.internalProps }
            width={size + space.total}
            height={size + space.total}
        >
            <rect
                x={space.margin}
                y={space.margin}
                width={size + space.padding * 2}
                height={size + space.padding * 2}
                fill={props.bgColor ?? '#FFF'}
                rx={props.bgRounded ? 10 : 0}
            />
            {rects}
        </svg>
    );
}
