import download from 'downloadjs';
import { useState } from 'react';

export { default as QrCodeCanvas } from './QrCodeCanvas';
export { default as QrCodeSVG } from './QrCodeSVG';

/**
 * React Hook to download Qrcode Type
 * @returns [ setQrcode, onDownload, isReady ]
 */
export type UseQrCodeDownload = [
    (QrCodeRef : HTMLCanvasElement | SVGSVGElement) => void,
    (fileName : string) => void,
    boolean
];

/**
 * React Hook to download Qrcode Canvas (PNG) or SVG
 * @param [suffix=''] add a suffix to the file name to download
 * @returns [ setQrcode, onDownload, isReady ]
 */
export function useQrCodeDownload(suffix : string = '') : UseQrCodeDownload {
    
    const [ qrcode, setQrcode ] = useState<HTMLCanvasElement | SVGSVGElement | null>(null);
    const isCanvas : boolean = qrcode instanceof HTMLCanvasElement;

    return [
        setQrcode,
        (fileName : string) => { if(qrcode) download(
            isCanvas ? (qrcode as HTMLCanvasElement).toDataURL('image/png') : new Blob([qrcode.outerHTML], {type:"image/svg+xml;charset=utf-8"}),
            fileName + suffix + (isCanvas ? '.png' : '.svg'),
            isCanvas ? 'image/png' : 'image/svg+xml'
        ) },
        qrcode !== null
    ];

}

export type {
    QrCodeColor,
    QrCodeColorEffect,
    QrCodeElement,
    QrCodeFormat,
    QrCodePart,
    QrCodePartOption,
    QrCodeProps,
    QrCodeStyle
} from './types';

