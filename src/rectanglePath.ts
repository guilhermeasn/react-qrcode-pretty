import { qrCodeRadiusNormalize } from "./helpers";
import type { QrcodeRectangleProps } from "./types";

export default function rectanglePath(props : QrcodeRectangleProps) {

    const radius = qrCodeRadiusNormalize(props.radius);

    return `
        M ${props.positionX + radius.top_left},${props.positionY}
        H ${props.positionX + props.width - radius.top_right}
        A ${radius.top_right},${radius.top_right} 0 0 1 ${props.positionX + props.width},${props.positionY + radius.top_right}
        V ${props.positionY + props.height - radius.bottom_right}
        A ${radius.bottom_right},${radius.bottom_right} 0 0 1 ${props.positionX + props.width - radius.bottom_right},${props.positionY + props.height}
        H ${props.positionX + radius.bottom_left}
        A ${radius.bottom_left},${radius.bottom_left} 0 0 1 ${props.positionX},${props.positionY + props.height - radius.bottom_left}
        V ${props.positionY + radius.top_left}
        A ${radius.top_left},${radius.top_left} 0 0 1 ${props.positionX + radius.top_left},${props.positionY}
        Z
    `.trim().replace(/\s+/g, ' ');

}
