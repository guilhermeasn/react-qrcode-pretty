import { qrCodeRadiusNormalize } from "./helpers";
import type { QrCodeRectangleProps } from "./types";

export default function rectanglePath(props : QrCodeRectangleProps) {

    const r = qrCodeRadiusNormalize(props.radius);

    return `
        M ${props.positionX + r.top_left},${props.positionY}
        H ${props.positionX + props.width - r.top_right}
        A ${r.top_right},${r.top_right} 0 0 1 ${props.positionX + props.width},${props.positionY + r.top_right}
        V ${props.positionY + props.height - r.bottom_right}
        A ${r.bottom_right},${r.bottom_right} 0 0 1 ${props.positionX + props.width - r.bottom_right},${props.positionY + props.height}
        H ${props.positionX + r.bottom_left}
        A ${r.bottom_left},${r.bottom_left} 0 0 1 ${props.positionX},${props.positionY + props.height - r.bottom_left}
        V ${props.positionY + r.top_left}
        A ${r.top_left},${r.top_left} 0 0 1 ${props.positionX + r.top_left},${props.positionY}
        Z
    `.trim().replace(/\s+/g, ' ');

}
