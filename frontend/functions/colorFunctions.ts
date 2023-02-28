import { hexToRgb, hslToRgb } from "@mui/system";

let colorMap = new Map<string, string>([
    ["white", "rgb(255,255,255)"],
    ["black", "rgb(0,0,0)"], 
    ["yellow", "rgb(255,255,0)"],
    //add more colors to account for all predetermined coluours here
]);

export function colorAppropiator(foreground : string, background : string){
    const fRGB = colorParser(foreground);
    const bRGB = colorParser(background);
    
    console.log(colorContrast(fRGB, bRGB))
    console.log(colorAdjust(fRGB, bRGB))
    console.log(colorContrast(colorAdjust(fRGB, bRGB), bRGB))
    return colorAdjust(fRGB, bRGB)
}


export function colorAdjust(foreground: string,  background: string){
    const contrast = colorContrast(foreground, background);
    if(contrast >= 4.5){
        return foreground
    }
    else{
        let newLum = 0
        let m = 0
        let values = [];
        if(luminance(foreground) > luminance(background)){
            newLum = 4.5*(luminance(background) + 0.05) - 0.05;
        }
        else{
           newLum = (luminance(background) + 0.05)/4.5 -0.05
        }
        return parseLum(newLum, rgbValues(foreground));
        values = rgbValues(foreground).map(a => Math.min((a * contrastMultiplier(m, luminance(foreground))), 255));
        console.log(contrastMultiplier(m, luminance(foreground)));
        const adjustedcolor = `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
        return adjustedcolor;
}}

export function colorParser(color : string){
    if(color[0] ==  '#'){
        return hexToRgb(color);
    }
    else if(color.toLowerCase().substring(0,3) == 'hsb'){
        return hslToRgb(color);
    }
    else if(color.toLowerCase().substring(0,3) == 'rgb'){
        return color;
    }
    else if(colorMap.has(color.toLowerCase())){
        return colorMap.get(color);
    }
    else{
        return "rgb(255,255,255)"
    }
}

function luminance(color :  string){
    const values = rgbValues(color);
    return values[0]/255 * 0.2126 + values[1]/255 * 0.7152 + values[2]/255 * 0.0722;
}

function rgbValues(color : string){
    return color.split(/[()]+/)[1].split(",").map(a => parseInt(a));
}

function colorContrast(c1 : string, c2 : string){
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    return (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05)
}

function contrastMultiplier(m: number, luminance: number){
    return m + 0.05 * ((m - 1) / luminance)
}

function parseLum(lum: number, rgbValues: Array<number>){
    let r = rgbValues[0];
    let g = rgbValues[1];
    let b = rgbValues[2];
    if(r + g + b == 0){
        r=1;
        g=1;
        b=1;
    }

    let nonZero = [];
    for (let i = 0; i < [r,g,b].length; i++){
        if ([r,g,b][i] != 0){
            nonZero = [[r,g,b][i], i]
        }
    }
    const ratios = [r,g,b].map(a => a/nonZero[0]);
    const divider = (0.2126*ratios[0] + 0.7152*ratios[1] + 0.0722*ratios[2])

    let r2 = lum/divider * 255 * ratios[0] * ratios[nonZero[1]];
    let b2 = lum/divider * 255 * ratios[1] * ratios[nonZero[1]];
    let c2 = lum/divider * 255 * ratios[2] * ratios[nonZero[1]];

    const newValues = [r2,b2,c2]
    newValues[nonZero[1]] = newValues[nonZero[1]]/ratios[nonZero[1]]

    return `rgb(${newValues[0]},${newValues[1]},${newValues[2]})`
}