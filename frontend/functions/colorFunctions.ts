import { hexToRgb, hslToRgb } from '@mui/system';

const colorMap = new Map<string, string>([
  ['aliceblue', 'rgb(240,248,255)'],
  ['antiquewhite', 'rgb(250,235,215)'],
  ['aqua', 'rgb(0,255,255)'],
  ['aquamarine', 'rgb(127,255,212)'],
  ['azure', 'rgb(240,255,255)'],
  ['beige', 'rgb(245,245,220)'],
  ['bisque', 'rgb(255,228,196)'],
  ['black', 'rgb(0,0,0)'],
  ['blanchedalmond', 'rgb(255,235,205)'],
  ['blue', 'rgb(0,0,255)'],
  ['blueviolet', 'rgb(138,43,226)'],
  ['brown', 'rgb(165,42,42)'],
  ['burlywood', 'rgb(222,184,135)'],
  ['cadetblue', 'rgb(95,158,160)'],
  ['chartreuse', 'rgb(127,255,0)'],
  ['chocolate', 'rgb(210,105,30)'],
  ['coral', 'rgb(255,127,80)'],
  ['cornflowerblue', 'rgb(100,149,237)'],
  ['cornsilk', 'rgb(255,248,220)'],
  ['crimson', 'rgb(220,20,60)'],
  ['cyan', 'rgb(0,255,255)'],
  ['darkblue', 'rgb(0,0,139)'],
  ['darkcyan', 'rgb(0,139,139)'],
  ['darkgoldenrod', 'rgb(184,134,11)'],
  ['darkgray', 'rgb(169,169,169)'],
  ['darkgreen', 'rgb(0,100,0)'],
  ['darkgrey', 'rgb(169,169,169)'],
  ['darkkhaki', 'rgb(189,183,107)'],
  ['darkmagenta', 'rgb(139,0,139)'],
  ['darkolivegreen', 'rgb(85,107,47)'],
  ['darkorange', 'rgb(255,140,0)'],
  ['darkorchid', 'rgb(153,50,204)'],
  ['darkred', 'rgb(139,0,0)'],
  ['darksalmon', 'rgb(233,150,122)'],
  ['darkseagreen', 'rgb(143,188,143)'],
  ['darkslateblue', 'rgb(72,61,139)'],
  ['darkslategray', 'rgb(47,79,79)'],
  ['darkslategrey', 'rgb(47,79,79)'],
  ['darkturquoise', 'rgb(0,206,209)'],
  ['darkviolet', 'rgb(148,0,211)'],
  ['deeppink', 'rgb(255,20,147)'],
  ['deepskyblue', 'rgb(0,191,255)'],
  ['dimgray', 'rgb(105,105,105)'],
  ['dimgrey', 'rgb(105,105,105)'],
  ['dodgerblue', 'rgb(30,144,255)'],
  ['firebrick', 'rgb(178,34,34)'],
  ['floralwhite', 'rgb(255,250,240)'],
  ['forestgreen', 'rgb(34,139,34)'],
  ['fuchsia', 'rgb(255,0,255)'],
  ['gainsboro', 'rgb(220,220,220)'],
  ['ghostwhite', 'rgb(248,248,255)'],
  ['gold', 'rgb(255,215,0)'],
  ['goldenrod', 'rgb(218,165,32)'],
  ['gray', 'rgb(128,128,128)'],
  ['green', 'rgb(0,128,0)'],
  ['greenyellow', 'rgb(173,255,47)'],
  ['grey', 'rgb(128,128,128)'],
  ['honeydew', 'rgb(240,255,240)'],
  ['hotpink', 'rgb(255,105,180)'],
  ['indianred', 'rgb(205,92,92)'],
  ['indigo', 'rgb(75,0,130)'],
  ['ivory', 'rgb(255,255,240)'],
  ['khaki', 'rgb(240,230,140)'],
  ['lavender', 'rgb(230,230,250)'],
  ['lavenderblush', 'rgb(255,240,245)'],
  ['lawngreen', 'rgb(124,252,0)'],
  ['lemonchiffon', 'rgb(255,250,205)'],
  ['lightblue', 'rgb(173,216,230)'],
  ['lightcoral', 'rgb(240,128,128)'],
  ['lightcyan', 'rgb(224,255,255)'],
  ['lightgoldenrodyellow', 'rgb(250,250,210)'],
  ['lightgray', 'rgb(211,211,211)'],
  ['lightgreen', 'rgb(144,238,144)'],
  ['lightgrey', 'rgb(211,211,211)'],
  ['lightpink', 'rgb(255,182,193)'],
  ['lightsalmon', 'rgb(255,160,122)'],
  ['lightseagreen', 'rgb(32,178,170)'],
  ['lightskyblue', 'rgb(135,206,250)'],
  ['lightslategray', 'rgb(119,136,153)'],
  ['lightslategrey', 'rgb(119,136,153)'],
  ['lightsteelblue', 'rgb(176,196,222)'],
  ['lightyellow', 'rgb(255,255,224)'],
  ['lime', 'rgb(0,255,0)'],
  ['limegreen', 'rgb(50,205,50)'],
  ['linen', 'rgb(250,240,230)'],
  ['magenta', 'rgb(255,0,255)'],
  ['maroon', 'rgb(128,0,0)'],
  ['mediumaquamarine', 'rgb(102,205,170)'],
  ['mediumblue', 'rgb(0,0,205)'],
  ['mediumorchid', 'rgb(186,85,211)'],
  ['mediumpurple', 'rgb(147,112,219)'],
  ['mediumseagreen', 'rgb(60,179,113)'],
  ['mediumslateblue', 'rgb(123,104,238)'],
  ['mediumspringgreen', 'rgb(0,250,154)'],
  ['mediumturquoise', 'rgb(72,209,204)'],
  ['mediumvioletred', 'rgb(199,21,133)'],
  ['midnightblue', 'rgb(25,25,112)'],
  ['mintcream', 'rgb(245,255,250)'],
  ['mistyrose', 'rgb(255,228,225)'],
  ['moccasin', 'rgb(255,228,181)'],
  ['navajowhite', 'rgb(255,222,173)'],
  ['navy', 'rgb(0,0,128)'],
  ['oldlace', 'rgb(253,245,230)'],
  ['olive', 'rgb(128,128,0)'],
  ['olivedrab', 'rgb(107,142,35)'],
  ['orange', 'rgb(255,165,0)'],
  ['orangered', 'rgb(255,69,0)'],
  ['orchid', 'rgb(218,112,214)'],
  ['palegoldenrod', 'rgb(238,232,170)'],
  ['palegreen', 'rgb(152,251,152)'],
  ['paleturquoise', 'rgb(175,238,238)'],
  ['palevioletred', 'rgb(219,112,147)'],
  ['papayawhip', 'rgb(255,239,213)'],
  ['peachpuff', 'rgb(255,218,185)'],
  ['peru', 'rgb(205,133,63)'],
  ['pink', 'rgb(255,192,203)'],
  ['plum', 'rgb(221,160,221)'],
  ['powderblue', 'rgb(176,224,230)'],
  ['purple', 'rgb(128,0,128)'],
  ['red', 'rgb(255,0,0)'],
  ['rosybrown', 'rgb(188,143,143)'],
  ['royalblue', 'rgb(65,105,225)'],
  ['saddlebrown', 'rgb(139,69,19)'],
  ['salmon', 'rgb(250,128,114)'],
  ['sandybrown', 'rgb(244,164,96)'],
  ['seagreen', 'rgb(46,139,87)'],
  ['seashell', 'rgb(255,245,238)'],
  ['sienna', 'rgb(160,82,45)'],
  ['silver', 'rgb(192,192,192)'],
  ['skyblue', 'rgb(135,206,235)'],
  ['slateblue', 'rgb(106,90,205)'],
  ['slategray', 'rgb(112,128,144)'],
  ['slategrey', 'rgb(112,128,144)'],
  ['snow', 'rgb(255,250,250)'],
  ['springgreen', 'rgb(0,255,127)'],
  ['steelblue', 'rgb(70,130,180)'],
  ['tan', 'rgb(210,180,140)'],
  ['teal', 'rgb(0,128,128)'],
  ['thistle', 'rgb(216,191,216)'],
  ['tomato', 'rgb(255,99,71)'],
  ['turquoise', 'rgb(64,224,208)'],
  ['violet', 'rgb(238,130,238)'],
  ['wheat', 'rgb(245,222,179)'],
  ['white', 'rgb(255,255,255)'],
  ['whitesmoke', 'rgb(245,245,245)'],
  ['yellow', 'rgb(255,255,0)'],
  ['yellowgreen', 'rgb(154,205,50'],
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

const HEX_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const HSL_REGEX = /^hsla?\(\s*([+-]?(?=\.\d|\d)\d*(?:\.\d+)?(?:[eE][+-]?\d+)?(?:deg|rad|grad|turn)?)(?=[,\s])\s*(?:,\s*)?([+-]?(?=\.\d|\d)\d*(?:\.\d+)?(?:[eE][+-]?\d+)?)%(?=[,\s])\s*(?:,\s*)?([+-]?(?=\.\d|\d)\d*(?:\.\d+)?(?:[eE][+-]?\d+)?)%(?:\s*[,/]\s*([+-]?(?=\.\d|\d)\d*(?:\.\d+)?(?:[eE][+-]?\d+)?%?))?\s*\)$/i;
const RGB_REGEX = /^rgba?\(\s*(?!\d+(?:\.|\s*-?)\d+\.\d+)-?(?:\d*\.\d+|\d+)(%?)(?:(?:\s*,\s*-?(?:\d+|\d*\.\d+)\1){2}(?:\s*,\s*-?(?:\d+|\d*\.\d+)%?)?|(?:(?:\s*-?\d*\.\d+|\s*-\d+|\s+\d+){2}|(?:\s*-?(?:\d+|\d*\.\d+)%){2})(?:\s*\/\s*-?(?:\d+|\d*\.\d+)%?)?)\s*\)$/i;

export function colorParser(color: string) {
  if (HEX_REGEX.test(color ?? '')) {
    return hexToRgb(color);
  }
  if (HSL_REGEX.test(color ?? '')) {
    return hslToRgb(color);
  }
  if (RGB_REGEX.test(color ?? '')) {
    return color;
  }
  if (colorMap.has(color?.toLowerCase() ?? '')) {
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

export function colorAppropiator(foreground: string | undefined, background: string) {
  const fRGB = colorParser(foreground);
  const bRGB = colorParser(background);
  return colorAdjust(fRGB, bRGB);
}
