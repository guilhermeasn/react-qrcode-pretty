import React from 'react';
export declare type QrCodeProps = {
    value: string;
    size?: number;
    color?: QrCodeColor | QrCodePart<QrCodeColor>;
    mode?: Mode;
    level?: ErrorCorrectionLevel;
    modules?: TypeNumber;
    image?: string;
    imageBig?: boolean;
    overlap?: boolean;
    margin?: number;
    padding?: number;
    variant?: QrCodeStyle | QrCodePart<QrCodeStyle>;
    divider?: boolean;
    bgColor?: string;
    bgRounded?: boolean;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};
export declare type QrCodeColor = string;
export declare type QrCodePart<T> = {
    eyes: T;
    body: T;
};
export declare type QrCodeStyle = ('standard' | 'rounded' | 'dots' | 'fluid' | 'reverse' | 'shower' | 'gravity' | 'morse');
export default function QrCodeCanvas(props: QrCodeProps): JSX.Element;
