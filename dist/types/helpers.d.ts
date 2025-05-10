import { QrcodeColor, QrcodeColorEffect, QrcodeImageSettings, QrcodePart, QrcodePartOption, QrcodeRadius, QrcodeRadiusEdge, QrcodeStyle, QrcodeWrapped } from "./types";
export declare function colorGradient(color: string, level: number): string;
export declare function getRandomColor(colorBase: string): string;
export declare function qrCodePartNormalize<T>(defaultReturn: T, part: undefined | null | T | QrcodePart<T>): QrcodePart<T>;
export declare function qrCodeImageNormalize(imageSet?: string | QrcodeImageSettings): QrcodeImageSettings | null;
export declare function qrCodeRadiusNormalize(radius?: QrcodeRadius): Required<QrcodeRadiusEdge>;
export declare function qrCodeStyleRadius(variant: QrcodeStyle, moduleSize: number, modules: number, wrapped: QrcodeWrapped, row: number, col: number, key: QrcodePartOption): QrcodeRadius;
export declare function getColor(color: QrcodeColor, effect: QrcodeColorEffect, col: number, row: number): QrcodeColor;
export declare function loadImageAsBase64(src: string): Promise<string>;
