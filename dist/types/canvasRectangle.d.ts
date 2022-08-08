export declare type CanvasRectangleProps = {
    canvas2d: CanvasRenderingContext2D;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    fill?: string | CanvasGradient | CanvasPattern | null;
    stroke?: string | CanvasGradient | CanvasPattern | null;
    radius?: number | Edge;
};
export declare type Edge = {
    top_left?: number;
    top_right?: number;
    bottom_left?: number;
    bottom_right?: number;
};
export default function canvasRectangle(props: CanvasRectangleProps): void;
