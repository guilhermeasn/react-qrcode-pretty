import download from 'downloadjs';
import { useState } from 'react';

export { default as QrCodeCanvas } from './QrCodeCanvas';
export { default as QrCodeSVG } from './QrCodeSVG';
export { default as QrCodeTable } from './QrCodeTable';

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
 * React Hook to download Qrcode
 * @returns [ setQrcode, onDownload, isReady ]
 */
export function useQrCodeDownload(sufix : string = '') : UseQrCodeDownload {
    
    const [ qrcode, setQrcode ] = useState<HTMLCanvasElement | SVGSVGElement | null>(null);
    const isCanvas : boolean = qrcode instanceof HTMLCanvasElement;

    return [
        setQrcode,
        (fileName : string) => { if(qrcode) download(
            isCanvas ? (qrcode as HTMLCanvasElement).toDataURL('png') : new Blob([qrcode.outerHTML], {type:"image/svg+xml;charset=utf-8"}),
            fileName + sufix + (isCanvas ? '.png' : '.svg'),
            isCanvas ? 'image/png' : 'image/svg+xml'
        ) },
        qrcode !== null
    ];

}

export type {
    QrCodeCanvasProps,
    QrCodeColor,
    QrCodeColorEffect,
    QrCodePart,
    QrCodePartOption,
    QrCodeStyle,
    QrCodeSVGProps,
    QrCodeTableProps
} from './types';

