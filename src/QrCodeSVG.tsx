import qrcodeGenerator from 'qrcode-generator';
import React, { JSX, useEffect, useRef } from 'react';

import rectanglePath from './rectanglePath';

import {
  getColor,
  loadImageAsBase64,
  qrcodeData,
  qrCodeStyleRadius
} from './helpers';

import type {
  QrcodeImageSettings,
  QrcodePartOption,
  QrcodeProps,
  QrcodeWrapped
} from './types';

/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export function QrcodeSvg(props: QrcodeProps<'SVG'>) {

  const SVG = useRef<SVGSVGElement>(null);

  const qrcode: QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? (props.image ? 'H' : 'M'));
  qrcode.addData(props.value ?? '', props.mode);
  qrcode.make();

  const modules: number = qrcode.getModuleCount();

  const {
    margin, padding, space, moduleSize,
    qrcodeSize, moduleEyeStart, moduleEyeEnd,
    variant, color, colorEffect, imagem
  } = qrcodeData(props, modules);

  const rects: JSX.Element[] = [];

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qrcode.isDark(row, col)) continue;

      const key: QrcodePartOption = (
        (col < 7 && row < 7) ||
        (col < 7 && row >= modules - 7) ||
        (col >= modules - 7 && row < 7)
      ) ? 'eyes' : 'body';

      const x = col * moduleSize + margin + padding;
      const y = row * moduleSize + margin + padding;
      const c = getColor(color[key], colorEffect[key], col, row);

      const wrapped: QrcodeWrapped = {
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
          d={rectanglePath({
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
              col,
              key
            )
          })}
          key={`${row}-${col}`}
          fill={c}
          stroke={props.divider && key === 'body' ? (props.bgColor ?? '#FFF') : undefined}
        />
      );
    }
  }

  useEffect(() => {
    if (typeof props.onReady === 'function' && SVG.current) {
      props.onReady(SVG.current);
    }
  }, [props, SVG]);

  return (
    <svg
      shapeRendering="geometricPrecision"
      {...props.internalProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${qrcodeSize + space} ${qrcodeSize + space}`}
      width={qrcodeSize + space}
      height={qrcodeSize + space}
      ref={SVG}
    >
      <rect
        x={margin}
        y={margin}
        width={qrcodeSize + padding * 2}
        height={qrcodeSize + padding * 2}
        fill={props.bgColor ?? '#FFF'}
        rx={props.bgRounded ? 10 : 0}
      />
      {rects}
      <Image
        imageSet={imagem}
        modules={modules}
        moduleSize={moduleSize}
        margin={margin}
        padding={padding}
        bgColor={props.bgColor}
      />
    </svg>
  );
}

function Image({
  imageSet, modules, moduleSize,
  margin, padding, bgColor
} : {
  imageSet: QrcodeImageSettings | null, modules: number, moduleSize: number,
  margin: number, padding: number, bgColor?: string
}) {

  const size = Math.floor(modules * moduleSize / 5);
  const position = size * 2 + margin + padding;

  const [src, setSrc] = React.useState<string>();

  useEffect(() => {
    if (src || !imageSet) return;
    loadImageAsBase64(imageSet.src).then(setSrc);
  }, [imageSet, src]);

  if (!src || !imageSet) return <></>;

  return <>

    {imageSet.overlap ? <></> : (
      <rect
        width={imageSet.width ?? size}
        height={imageSet.height ?? size}
        x={imageSet.positionX ?? position}
        y={imageSet.positionY ?? position}
        fill={bgColor ?? '#FFF'}
      />
    )}

    <image
      href={src}
      width={imageSet.width ?? size}
      height={imageSet.height ?? size}
      x={imageSet.positionX ?? position}
      y={imageSet.positionY ?? position}
      preserveAspectRatio="xMidYMid meet"
    />

  </>;

}

export default QrcodeSvg;
