import download from 'downloadjs';
import { useState } from 'react';

export { default as QrcodeCanvas } from './QrcodeCanvas';
export { default as QrcodeSVG } from './QrcodeSVG';

/**
 * React Hook to download Qrcode Type
 * @returns [ setQrcode, download, isReady ]
 */
export type UseQrcodeDownload = [
  (QrcodeRef: HTMLCanvasElement | SVGSVGElement) => void,
  (fileName: string) => void,
  boolean
];

/**
 * React Hook to download Qrcode Canvas (PNG) or SVG
 * @param [suffix=''] add a suffix to the file name to download
 * @returns [ setQrcode, download, isReady ]
 */
export function useQrcodeDownload(suffix: string = ''): UseQrcodeDownload {

  const [qrcode, setQrcode] = useState<HTMLCanvasElement | SVGSVGElement | null>(null);
  const isCanvas: boolean = qrcode instanceof HTMLCanvasElement;

  return [
    setQrcode,
    (fileName: string) => {
      if (qrcode) download(
        isCanvas ? (qrcode as HTMLCanvasElement).toDataURL('image/png') : new Blob([qrcode.outerHTML], { type: "image/svg+xml;charset=utf-8" }),
        fileName + suffix + (isCanvas ? '.png' : '.svg'),
        isCanvas ? 'image/png' : 'image/svg+xml'
      )
    },
    qrcode !== null
  ];

}

export type {
  QrcodeColor,
  QrcodeColorEffect,
  QrcodeElement,
  QrcodeFormat,
  QrcodeImageSettings,
  QrcodePart,
  QrcodePartOption,
  QrcodeProps,
  QrcodeRadius,
  QrcodeRadiusEdge,
  QrcodeRectangleProps,
  QrcodeStyle,
  QrcodeWrapped
} from './types';

