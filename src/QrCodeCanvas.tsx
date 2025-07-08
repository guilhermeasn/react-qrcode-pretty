import qrcodeGenerator from 'qrcode-generator';
import { useEffect, useRef } from 'react';

import canvasRectangle from './rectangleCanvas';

import {
  getColor,
  qrcodeData,
  qrCodeStyleRadius
} from './helpers';

import type {
  QrcodeImageSettings,
  QrcodePartOption,
  QrcodeProps,
  QrcodeRectangleProps,
  QrcodeWrapped
} from './types';

/**
 * Qrcode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export function QrcodeCanvas(props: QrcodeProps<'canvas'>) {

  const canvas = useRef<HTMLCanvasElement>(null);

  const qrcode: QRCode = qrcodeGenerator(props.modules ?? 0, props.level ?? (props.image ? 'H' : 'M'));
  qrcode.addData(props.value ?? '', props.mode);
  qrcode.make();

  const modules: number = qrcode.getModuleCount();

  const {
    margin, padding, space, moduleSize,
    qrcodeSize, moduleEyeStart, moduleEyeEnd,
    variant, color, colorEffect, imagem
  } = qrcodeData(props, modules);

  useEffect(() => {

    if (!canvas.current) return;

    const context = canvas.current.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, space + qrcodeSize, space + qrcodeSize);

    canvasRectangle(context, {
      height: padding * 2 + qrcodeSize,
      width: padding * 2 + qrcodeSize,
      positionX: margin,
      positionY: margin,
      fill: props.bgColor ?? '#FFF',
      radius: props.bgRounded ? 10 : undefined
    });

    for (let row = 0; row < modules; row++) {

      for (let col = 0; col < modules; col++) {

        if (!qrcode.isDark(row, col)) continue;

        let key: QrcodePartOption = (
          (col < moduleEyeStart && row < moduleEyeStart) ||
          (col < moduleEyeStart && row > moduleEyeEnd) ||
          (col > moduleEyeEnd && row < moduleEyeStart)
        ) ? 'eyes' : 'body';

        let changer: Partial<QrcodeRectangleProps> = {
          stroke: key === 'body' && props.divider ? (props.bgColor ?? '#FFF') : null
        };

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

        changer.radius = qrCodeStyleRadius(
          variant[key],
          moduleSize,
          modules,
          wrapped,
          row,
          col,
          key
        );

        canvasRectangle(context, {
          positionX: col * moduleSize + margin + padding,
          positionY: row * moduleSize + margin + padding,
          height: moduleSize,
          width: moduleSize,
          fill: getColor(color[key], colorEffect[key], col, row),
          ...changer
        });

      }

    }

    if (imagem) addImage(
      context, imagem, modules,
      moduleSize, margin, padding,
      props.bgColor
    );

    if (typeof props.onReady === 'function') {
      props.onReady(canvas.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return <canvas
    {...props.internalProps}
    ref={canvas}
    width={qrcodeSize + space}
    height={qrcodeSize + space}
  >{props.children}</canvas>;

}

function addImage(context: CanvasRenderingContext2D, imageSet: QrcodeImageSettings, modules: number, moduleSize: number, margin: number, padding: number, bgColor?: string) {
  const image = new Image();
  image.src = imageSet.src;
  image.onload = () => {
    const size = Math.floor(modules * moduleSize / 5);
    const position = size * 2 + margin + padding;
    if (!imageSet.overlap) canvasRectangle(context, {
      height: imageSet.height ?? size,
      width: imageSet.width ?? size,
      positionX: imageSet.positionX ?? position,
      positionY: imageSet.positionY ?? position,
      fill: bgColor ?? '#FFF',
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

export default QrcodeCanvas;
