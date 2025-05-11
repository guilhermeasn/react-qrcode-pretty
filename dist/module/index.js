import download from 'downloadjs';
import { useState } from 'react';
export { default as QrcodeCanvas } from './QrcodeCanvas';
export { default as QrcodeSVG } from './QrcodeSVG';
/**
 * React Hook to download Qrcode Canvas (PNG) or SVG
 * @param [suffix=''] add a suffix to the file name to download
 * @returns [ setQrcode, download, isReady ]
 */
export function useQrcodeDownload(suffix = '') {
    const [qrcode, setQrcode] = useState(null);
    const isCanvas = qrcode instanceof HTMLCanvasElement;
    return [
        setQrcode,
        (fileName) => {
            if (qrcode)
                download(isCanvas ? qrcode.toDataURL('image/png') : new Blob([qrcode.outerHTML], { type: "image/svg+xml;charset=utf-8" }), fileName + suffix + (isCanvas ? '.png' : '.svg'), isCanvas ? 'image/png' : 'image/svg+xml');
        },
        qrcode !== null
    ];
}
