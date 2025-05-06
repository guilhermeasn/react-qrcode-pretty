/**
 * Color string
 */
export type QrCodeColor = string;

/**
 * Apply effects to coloring options
 */
export type QrCodeColorEffect = (
    | 'gradient-dark-vertical'
    | 'gradient-dark-horizontal'
    | 'gradient-dark-diagonal'
    | 'gradient-light-vertical'
    | 'gradient-light-horizontal'
    | 'gradient-light-diagonal'
    | 'colored'
    | 'none'
);

export type QrCodePartOption = (
    | 'eyes'
    | 'body'
);

/**
 * Qrcode Parts (eyes and body)
 */
export type QrCodePart<T> = (
    Record<QrCodePartOption, T>
);

export type QrCodeImageSettings = {
    src: string;
    width ?: number;
    height ?: number;
    positionX ?: number;
    positionY ?: number;
}

/**
 * Style variations for qrcode parts
 */
export type QrCodeStyle = (
    | 'standard' 
    | 'rounded'  
    | 'dots'     
    | 'circle'   
    | 'fluid'    
    | 'reverse'  
    | 'shower'   
    | 'gravity'  
    | 'morse'
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
 * Props of the QrCode Component
 */
export type QrCodeBaseProps = {

    /**
     * Qrcode payload (required)
     */
    value : string;

    /**
     * Size of the qrcode without margin and padding
     */
    size ?: number;

    /**
     * Resize ready qrcode with CSS
     */
     resize ?: number;

    /**
     * Foreground color for the entire qrcode or for each part (eyes and body) of the qrcode
     */
    color ?: QrCodeColor | QrCodePart<QrCodeColor>;

    /**
     * Apply effects to coloring
     */
    colorEffect ?: QrCodeColorEffect | QrCodePart<QrCodeColorEffect>;

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
    image ?: string | QrCodeImageSettings;

    /**
     * For the image to overlay the qrcode without cropping it
     */
    overlap ?: boolean;

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
    variant ?: QrCodeStyle | QrCodePart<QrCodeStyle>;

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

}

export type QrCodeCanvasProps = QrCodeBaseProps & {
    
}

export type QrCodeRectangleProps = {
    positionX : number;
    positionY : number;
    width     : number;
    height    : number;
    fill     ?: string | null;
    stroke   ?: string | null; 
    radius   ?: QrCodeRadius
}

export type QrCodeRadius = number | QrCodeRadiusEdge;

export type QrCodeRadiusEdge = {
    top_left     ?: number;
    top_right    ?: number;
    bottom_left  ?: number;
    bottom_right ?: number;
}

export type QrCodeWrapped = Record<'row' | 'col', {
    before: boolean;
    after: boolean;
}>;
