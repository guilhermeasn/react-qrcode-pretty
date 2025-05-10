import { QrcodeColor, QrcodeColorEffect, QrcodeImageSettings, QrcodePart, QrcodePartOption, QrcodeRadius, QrcodeRadiusEdge, QrcodeStyle, QrcodeWrapped } from "./types";

type ColorRGB = {
    r : number;
    g : number;
    b : number;
}

type ColorLevel = (
    | 'light'
    | 'medium'
    | 'dark'
);

function colorHexToRGB(hex: string) : ColorRGB {

    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => (
        r + r + g + g + b + b
    ));

    const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };

}

function colorRGBtoHex({ r, g, b } : ColorRGB) : string {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export function colorGradient(color: string, level: number) : string {

    const rgb = colorHexToRGB(color);

    for(let k in rgb) {
        rgb[k as keyof ColorRGB] += level;
        if(rgb[k as keyof ColorRGB] > 255) rgb[k as keyof ColorRGB] = 255;
        if(rgb[k as keyof ColorRGB] < 0) rgb[k as keyof ColorRGB] = 0;
    }

    return colorRGBtoHex(rgb);

}

function colorLevel(color: string) : ColorLevel {
    const sum : number = Object.values(colorHexToRGB(color)).reduce((t, c) => t + c, 0);
    return sum > 510 ? 'light' : sum > 255 ? 'medium' : 'dark';
}

function getRandomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomColor(colorBase: string) : string {
    const level = colorLevel(colorBase);
    const min : number = level === 'dark' ? 0 : level === 'medium' ? 63 : 127;
    const max : number = level === 'dark' ? 127 : level === 'medium' ? 191 : 255;
    return colorRGBtoHex({ r: getRandomInt(min, max), g: getRandomInt(min, max), b: getRandomInt(min, max) });
}

export function qrCodePartNormalize<T>(defaultReturn : T, part : undefined | null | T | QrcodePart<T>) : QrcodePart<T> {

    return (part
        && typeof part === 'object'
        && 'eyes' in part
        && 'body' in part
    ) ? part : {
        eyes: part ?? defaultReturn,
        body: part ?? defaultReturn
    };
    
}

export function qrCodeImageNormalize(imageSet ?: string | QrcodeImageSettings) : QrcodeImageSettings | null {
    if(imageSet && typeof imageSet === 'object') return imageSet;
    if(typeof imageSet === 'string') return { src: imageSet };
    return null;
}

export function qrCodeRadiusNormalize(radius?: QrcodeRadius) : Required<QrcodeRadiusEdge> {
    return ( typeof radius === 'number' || !radius ) ? {
        top_left: radius ?? 0, top_right: radius ?? 0,
        bottom_left: radius ?? 0, bottom_right: radius ?? 0
    } : {
        top_left: 0, top_right: 0,
        bottom_left:  0, bottom_right: 0,
        ...radius
    }
}

export function qrCodeStyleRadius(
    variant : QrcodeStyle,
    moduleSize : number,
    modules: number,
    wrapped : QrcodeWrapped,
    row: number,
    col: number,
    key: QrcodePartOption
) : QrcodeRadius {

    const radius = moduleSize / 1.6;

    switch(variant) {

        case 'dots': return radius;

        case 'rounded': return moduleSize / 2;

        case 'circle': return {
            top_left:     !wrapped.col.before && !wrapped.row.before && wrapped.col.after && wrapped.row.after ? moduleSize * 1.35 : 0,
            top_right:    wrapped.col.before && !wrapped.row.before && !wrapped.col.after && wrapped.row.after ? moduleSize * 1.35 : 0,
            bottom_left:  !wrapped.col.before && wrapped.row.before && wrapped.col.after && !wrapped.row.after ? moduleSize * 1.35 : 0,
            bottom_right: wrapped.col.before && wrapped.row.before && !wrapped.col.after && !wrapped.row.after ? moduleSize * 1.35 : 0
        };
        
        case 'fluid': return {
            top_right:    !wrapped.col.after  && !wrapped.row.before ? radius : 0,
            top_left:     !wrapped.col.before && !wrapped.row.before ? radius : 0,
            bottom_right: !wrapped.col.after  && !wrapped.row.after  ? radius : 0,
            bottom_left:  !wrapped.col.before && !wrapped.row.after  ? radius : 0
        };

        case 'reverse': return {
            top_right:    wrapped.col.after  && wrapped.row.before ? radius : 0,
            top_left:     wrapped.col.before && wrapped.row.before ? radius : 0,
            bottom_right: wrapped.col.after  && wrapped.row.after  ? radius : 0,
            bottom_left:  wrapped.col.before && wrapped.row.after  ? radius : 0
        };
            

        case 'morse': return !wrapped.col.before && !wrapped.col.after ? radius : {
            top_left:     !wrapped.col.before ? radius : 0,
            bottom_left:  !wrapped.col.before ? radius : 0,
            top_right:    !wrapped.col.after  ? radius : 0,
            bottom_right: !wrapped.col.after  ? radius : 0
        };

        
        case 'shower': return !wrapped.row.before && !wrapped.row.after ? radius : {
            top_left:     !wrapped.row.before ? radius : 0,
            top_right:    !wrapped.row.before ? radius : 0,
            bottom_left:  !wrapped.row.after  ? radius : 0,
            bottom_right: !wrapped.row.after  ? radius : 0
        };

        case 'gravity':
            const half = Math.floor(modules / 2);
            return {
                top_right:    !wrapped.col.after  && !wrapped.row.before && !(row > half && col < half) ? radius : 0,
                top_left:     !wrapped.col.before && !wrapped.row.before && !(row > half && col > half) ? radius : 0,
                bottom_right: !wrapped.col.after  && !wrapped.row.after  && !(row < half && col < half) ? radius : 0,
                bottom_left:  !wrapped.col.before && !wrapped.row.after  && !(row < half && col > half) ? radius : 0
            };

        case 'italic': return {
            top_right: 0,
            top_left: !wrapped.col.before && !wrapped.row.before ? (key === 'eyes' ? moduleSize * 1.2 : radius) : 0,
            bottom_right: !wrapped.col.after  && !wrapped.row.after ? (key === 'eyes' ? moduleSize * 1.2 : radius) : 0,
            bottom_left: 0
        }

        default: return 0;

    }

}

export function getColor(color : QrcodeColor, effect : QrcodeColorEffect , col: number, row: number) : QrcodeColor {

    switch(effect) {

        case 'gradient-dark-vertical': return colorGradient(color, row * -3);
        case 'gradient-dark-horizontal': return colorGradient(color, col * -3);
        case 'gradient-dark-diagonal': return colorGradient(color, (col + row) * -2);
        case 'gradient-light-vertical': return colorGradient(color, row * 3);
        case 'gradient-light-horizontal': return colorGradient(color, col * 3);
        case 'gradient-light-diagonal': return colorGradient(color, (col + row) * 2);
        
        case 'colored': return getRandomColor(color);

        default: return color;

    }

}

export async function loadImageAsBase64(src: string): Promise<string> {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}
