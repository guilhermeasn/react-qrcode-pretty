import type { HTMLAttributes } from "react";

/**
 * Color string
 */
export type QrcodeColor = string;

/**
 * Apply effects to coloring options
 */
export type QrcodeColorEffect = (
    | 'gradient-dark-vertical'
    | 'gradient-dark-horizontal'
    | 'gradient-dark-diagonal'
    | 'gradient-light-vertical'
    | 'gradient-light-horizontal'
    | 'gradient-light-diagonal'
    | 'colored'
    | 'none'
);

/**
 * Qrcode Parts options
 */
export type QrcodePartOption = (
    | 'eyes'
    | 'body'
);

/**
 * Qrcode Parts (eyes and body)
 */
export type QrcodePart<T> = (
    Record<QrcodePartOption, T>
);

/**
 * Settings for the image to be inserted into the qrcode
 */
export type QrcodeImageSettings = {
    src: string;
    width ?: number;
    height ?: number;
    positionX ?: number;
    positionY ?: number;
    overlap ?: boolean;
}

/**
 * Style variations for qrcode parts
 */
export type QrcodeStyle = (
    | 'standard' 
    | 'rounded'  
    | 'dots'     
    | 'circle'   
    | 'fluid'    
    | 'reverse'  
    | 'shower'   
    | 'gravity'  
    | 'morse'
    | 'italic'
    | 'inclined'
);

type TypeNumber =
  | 0 // Automatic type number
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40
  ;

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

type Mode = 'Numeric' | 'Alphanumeric' | 'Byte' /* Default */ | 'Kanji';

/**
 * Available formats for qrcode
 */
export type QrcodeFormat = 'canvas' | 'SVG';

/**
 * Qrcode html element
 */
export type QrcodeElement<F extends QrcodeFormat> = F extends 'canvas' ? HTMLCanvasElement : SVGSVGElement;

/**
 * Common props of the Qrcode Components
 */
export type QrcodeProps<F extends QrcodeFormat> = {

    /**
     * Qrcode payload (required)
     */
    value : string;

    /**
     * Size of the qrcode without margin and padding
     */
    size ?: number;

    /**
     * Foreground color for the entire qrcode or for each part (eyes and body) of the qrcode
     */
    color ?: QrcodeColor | QrcodePart<QrcodeColor>;

    /**
     * Apply effects to coloring
     */
    colorEffect ?: QrcodeColorEffect | QrcodePart<QrcodeColorEffect>;

    /**
     * Mode that payload (value) will be logged
     */
    mode ?: Mode;

    /**
     * Error correction level
     * - Level L - up to 7% damage
     * - Level M - up to 15% damage
     * - Level Q - up to 25% damage
     * - Level H - up to 30% damage
     */
    level ?: ErrorCorrectionLevel;

    /**
     * Number of qrcode modules
     * - 0 is auto
     */
    modules ?: TypeNumber;

    /**
     * Location (src) of an image to be inserted into the center of the qrcode
     */
    image ?: string | QrcodeImageSettings;

    /**
     * Margin size. Area without background color
     */
    margin ?: number;

    /**
     * Padding size. Area with background color
     */
    padding ?: number;

    /**
     * Style applied to the entire qrcode or each part (eyes and body) of it
     */
    variant ?: QrcodeStyle | QrcodePart<QrcodeStyle>;

    /**
     * Active a small separation between the qrcode body points
     */
    divider ?: boolean;

    /**
     * Background color
     */
    bgColor ?: string;

    /**
     * Background color rounded
     */
    bgRounded ?: boolean;

    /**
     * The tag children
     */
    children ?: React.ReactNode;

    /**
     * The internal props attributes
     */
    internalProps ?: HTMLAttributes<QrcodeElement<F>>;

    /**
     * Provides element properties and methods when available.
     * To be used with the useQrcodeDownload hook.
     */
    onReady ?: (element : QrcodeElement<F>) => void

}

export type QrcodeRectangleProps = {
    positionX : number;
    positionY : number;
    width     : number;
    height    : number;
    fill     ?: string | null;
    stroke   ?: string | null; 
    radius   ?: QrcodeRadius
}

export type QrcodeRadius = number | QrcodeRadiusEdge;

export type QrcodeRadiusEdge = {
    top_left     ?: number;
    top_right    ?: number;
    bottom_left  ?: number;
    bottom_right ?: number;
}

export type QrcodeWrapped = Record<'row' | 'col', {
    before: boolean;
    after: boolean;
}>;
