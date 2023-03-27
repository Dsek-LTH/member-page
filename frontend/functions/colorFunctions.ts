import { hexToRgb, hslToRgb } from '@mui/system';

const colorMap = new Map<string, string>([
  ['white', 'rgb(255,255,255)'],
  ['black', 'rgb(0,0,0)'],
  ['yellow', 'rgb(255,255,0)'],
]);

function rgbValues(color: string) {
  return color
    .split(/[()]+/)[1]
    .split(',')
    .map((a) => parseInt(a, 10));
}

function luminance(color: string) {
  const values = rgbValues(color);
  return (
    (values[0] / 255) * 0.2126
    + (values[1] / 255) * 0.7152
    + (values[2] / 255) * 0.0722
  );
}

function colorContrast(c1: string, c2: string) {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function colorParser(color: string) {
  if (color[0] === '#') {
    return hexToRgb(color);
  }
  if (color.toLowerCase().substring(0, 3) === 'hsb') {
    return hslToRgb(color);
  }
  if (color.toLowerCase().substring(0, 3) === 'rgb') {
    return color;
  }
  if (colorMap.has(color.toLowerCase())) {
    return colorMap.get(color);
  }
  return 'rgb(255,255,255)';
}

function parseLum(lum: number, rgbList: Array<number>) {
  let r = rgbList[0];
  let g = rgbList[1];
  let b = rgbList[2];
  if (r + g + b === 0) {
    r = 1;
    g = 1;
    b = 1;
  }
  let nonZero = [];
  for (let i = 0; i < [r, g, b].length; i += 1) {
    if ([r, g, b][i] !== 0) {
      nonZero = [[r, g, b][i], i];
    }
  }
  const ratios = [r, g, b].map((a) => a / nonZero[0]);
  const divider = 0.2126 * ratios[0] + 0.7152 * ratios[1] + 0.0722 * ratios[2];
  const r2 = (lum / divider) * 255 * ratios[0] * ratios[nonZero[1]];
  const b2 = (lum / divider) * 255 * ratios[1] * ratios[nonZero[1]];
  const c2 = (lum / divider) * 255 * ratios[2] * ratios[nonZero[1]];
  const newValues = [r2, b2, c2];
  newValues[nonZero[1]] /= ratios[nonZero[1]];
  return `rgb(${newValues[0]},${newValues[1]},${newValues[2]})`;
}

export function colorAdjust(foreground: string, background: string) {
  const contrast = colorContrast(foreground, background);
  if (contrast >= 4.5) {
    return foreground;
  }
  let newLum = 0;
  if (luminance(foreground) > luminance(background)) {
    newLum = 4.5 * (luminance(background) + 0.05) - 0.05;
  } else {
    newLum = (luminance(background) + 0.05) / 4.5 - 0.05;
  }
  return parseLum(newLum, rgbValues(foreground));
}

export function colorAppropiator(foreground: string, background: string) {
  const fRGB = colorParser(foreground);
  const bRGB = colorParser(background);
  return colorAdjust(fRGB, bRGB);
}
