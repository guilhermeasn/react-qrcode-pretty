/**
 * Color string
 */
export type QrCodeColor = string;

export type QrCodeColorEffect = (
    | 'gradient-dark-vertical'
    | 'gradient-dark-horizontal'
    | 'gradient-light-vertical'
    | 'gradient-light-horizontal'
    | 'gradient-light'
    | 'colored'
    | 'none'
    | null
);

/**
 * Qrcode Parts (eyes and body)
 */
export type QrCodePart<T> = {
    eyes : T;
    body : T;
}

/**
 * Style variations for qrcode parts
 */
export type QrCodeStyle = (
    'standard' |
    'rounded'  |
    'dots'     |
    'circle'   |
    'fluid'    |
    'reverse'  |
    'shower'   |
    'gravity'  |
    'morse'
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
export type QrCodeProps = {

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
    image ?: string;

    /**
     * Imagem a ser exibida em tamanho grande
     */
    imageBig ?: boolean;

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

    /**
     * The canvas tag children
     */
    children ?: React.ReactNode;

    /**
     * The canvas attributes
     */
    canvasProps ?: React.HTMLAttributes<HTMLCanvasElement>;

    /**
     * Provides canvas properties and methods when available.
     */
    onReady ?: (canvas : HTMLCanvasElement) => void

}
