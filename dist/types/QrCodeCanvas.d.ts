import React from 'react';
/**
 * Props of the QrCode Component
 */
export declare type QrCodeProps = {
    /**
     * Qrcode payload (required)
     */
    value: string;
    /**
     * Size of the qrcode
     */
    size?: number;
    /**
     * Foreground color for the entire qrcode or for each part (eyes and body) of the qrcode
     */
    color?: QrCodeColor | QrCodePart<QrCodeColor>;
    /**
     * Mode that payload (value) will be logged
     */
    mode?: Mode;
    /**
     * Error correction level
     */
    level?: ErrorCorrectionLevel;
    /**
     * Number of qrcode modules
     * - 0 is auto
     */
    modules?: TypeNumber;
    /**
     * Location (src) of an image to be inserted into the center of the qrcode
     */
    image?: string;
    /**
     * Imagem a ser exibida em tamanho grande
     */
    imageBig?: boolean;
    /**
     * For the image to overlay the qrcode without cropping it
     */
    overlap?: boolean;
    /**
     * CSS margin
     */
    margin?: number | string;
    /**
     * CSS padding
     */
    padding?: number | string;
    /**
     * Style applied to the entire qrcode or each part (eyes and body) of it
     */
    variant?: QrCodeStyle | QrCodePart<QrCodeStyle>;
    /**
     * Active a small separation between the qrcode body points
     */
    divider?: boolean;
    /**
     * CSS background color
     */
    bgColor?: string;
    /**
     * CSS rounded border
     */
    bgRounded?: boolean;
    /**
     * CSS classes
     */
    className?: string;
    /**
     * The canvas tag children
     */
    children?: React.ReactNode;
    /**
     * CSS object
     */
    style?: React.CSSProperties;
};
/**
 * Color string
 */
export declare type QrCodeColor = string;
/**
 * Qrcode Parts (eyes and body)
 */
export declare type QrCodePart<T> = {
    eyes: T;
    body: T;
};
/**
 * Style variations for qrcode parts
 */
export declare type QrCodeStyle = ('standard' | 'rounded' | 'dots' | 'fluid' | 'reverse' | 'shower' | 'gravity' | 'morse');
/**
 * QrCode React Component
 * @author Guilherme Neves <guilhermeasn@yahoo.com.br>
 */
export default function QrCodeCanvas(props: QrCodeProps): JSX.Element;
