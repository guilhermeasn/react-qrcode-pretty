export type CanvasRectangleProps = {
    canvas2d  : CanvasRenderingContext2D;
    positionX : number;
    positionY : number;
    width     : number;
    height    : number;
    fill     ?: string | CanvasGradient | CanvasPattern | null;
    stroke   ?: string | CanvasGradient | CanvasPattern | null; 
    radius   ?: number | Edge;
}

export type Edge = {
    top_left     ?: number;
    top_right    ?: number;
    bottom_left  ?: number;
    bottom_right ?: number;
}


export default function canvasRectangle(props : CanvasRectangleProps) {

    const radius : Required<Edge> = ( typeof props.radius === 'number' || !props.radius ) ? {
        top_left:     props.radius ?? 0,
        top_right:    props.radius ?? 0,
        bottom_left:  props.radius ?? 0,
        bottom_right: props.radius ?? 0
    } : {
        top_left:     0,
        top_right:    0,
        bottom_left:  0,
        bottom_right: 0,
        ...props.radius
    }
    
    
    props.canvas2d.beginPath();

    props.canvas2d.moveTo(props.positionX + radius.top_left, props.positionY);

    props.canvas2d.lineTo(props.positionX + props.width - radius.top_right, props.positionY);
    props.canvas2d.quadraticCurveTo(props.positionX + props.width, props.positionY, props.positionX + props.width, props.positionY + radius.top_right);

    props.canvas2d.lineTo(props.positionX + props.width, props.positionY + props.height - radius.bottom_right);
    props.canvas2d.quadraticCurveTo(props.positionX + props.width, props.positionY + props.height, props.positionX + props.width - radius.bottom_right, props.positionY + props.height);

    props.canvas2d.lineTo(props.positionX + radius.bottom_left, props.positionY + props.height);
    props.canvas2d.quadraticCurveTo(props.positionX, props.positionY + props.height, props.positionX, props.positionY + props.height - radius.bottom_left);

    props.canvas2d.lineTo(props.positionX, props.positionY + radius.top_left);
    props.canvas2d.quadraticCurveTo(props.positionX, props.positionY, props.positionX + radius.top_left, props.positionY);

    props.canvas2d.closePath();

    if(props.fill) {
      props.canvas2d.fill();
      props.canvas2d.fillStyle = props.fill;
    }
    
    if(props.stroke) {
      props.canvas2d.stroke();
      props.canvas2d.strokeStyle = props.stroke;
    }

}
