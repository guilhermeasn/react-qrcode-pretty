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
