import { hexToRgb, hslToRgb } from "@mui/system";

let colorMap = new Map<string, string>([
    ["white" , "rgb(255,255,255)"],
    ["black" , "rgb(0,0,0)"], 
    //add more colors to account for all predetermined coluours here
]);

export function colorAppropiator(foreground : string, background : string){
    const fRGB = colorParser(foreground);
    const bRGP = colorParser(background);
    const contrast = colorContrast(fRGB, bRGP);
    
    if(contrast >= 4.5){
        return fRGB;
    }
    else{
        return colorAdjust(fRGB, contrast);
    }
}
export function colorAdjust(color: string, contrast : number){
    const values = rgbValues(color).map(a => (a * 4.5 / contrast) % 255);
    const adjustedcolor = `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
    return adjustedcolor;
}

export function colorParser(color : string){
    if(color[0] ==  '#'){
        return hexToRgb(color);
    }
    else if(color.toLowerCase().substring(0,2) == 'hsb'){
        return hslToRgb(color);
    }
    else if(color.toLowerCase().substring (0,2) == 'rgb'){
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
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function rgbValues(color : string){
    return color.split(/[()]+/)[1].split(",").map(a => parseInt(a));
}

function colorContrast(c1 : string, c2 : string){
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    if(l1 > l2){
        return (l1 + 0.05) / (l2 + 0.05);
    }
    else{
        return (l2 +0.05) / (l1 + 0.05);
    }

}