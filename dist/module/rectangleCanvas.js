import { qrCodeRadiusNormalize } from "./helpers";
export default function rectangleCanvas(context, props) {
    const radius = qrCodeRadiusNormalize(props.radius);
    context.beginPath();
    context.moveTo(props.positionX + radius.top_left, props.positionY);
    context.lineTo(props.positionX + props.width - radius.top_right, props.positionY);
    context.quadraticCurveTo(props.positionX + props.width, props.positionY, props.positionX + props.width, props.positionY + radius.top_right);
    context.lineTo(props.positionX + props.width, props.positionY + props.height - radius.bottom_right);
    context.quadraticCurveTo(props.positionX + props.width, props.positionY + props.height, props.positionX + props.width - radius.bottom_right, props.positionY + props.height);
    context.lineTo(props.positionX + radius.bottom_left, props.positionY + props.height);
    context.quadraticCurveTo(props.positionX, props.positionY + props.height, props.positionX, props.positionY + props.height - radius.bottom_left);
    context.lineTo(props.positionX, props.positionY + radius.top_left);
    context.quadraticCurveTo(props.positionX, props.positionY, props.positionX + radius.top_left, props.positionY);
    if (props.fill) {
        context.fillStyle = props.fill;
        context.fill();
    }
    if (props.stroke) {
        context.strokeStyle = props.stroke;
        context.stroke();
    }
    context.closePath();
}
