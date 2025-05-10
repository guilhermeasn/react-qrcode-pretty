export { default as QrcodeCanvas } from './QrcodeCanvas';
export { default as QrcodeSVG } from './QrcodeSVG';
/**
 * React Hook to download Qrcode Type
 * @returns [ setQrcode, download, isReady ]
 */
export declare type UseQrcodeDownload = [
    (QrcodeRef: HTMLCanvasElement | SVGSVGElement) => void,
    (fileName: string) => void,
    boolean
];
/**
 * React Hook to download Qrcode Canvas (PNG) or SVG
 * @param [suffix=''] add a suffix to the file name to download
 * @returns [ setQrcode, download, isReady ]
 */
export declare function useQrcodeDownload(suffix?: string): UseQrcodeDownload;
export type { QrcodeColor, QrcodeColorEffect, QrcodeElement, QrcodeFormat, QrcodePart, QrcodePartOption, QrcodeProps, QrcodeStyle } from './types';
