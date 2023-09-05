import { RefObject } from 'react';

const MAX_WIDTH = 5000;
const MAX_HEIGHT = 5000;

function getWidthAndHeight(image: HTMLImageElement) {
  let { width } = image;
  let { height } = image;
  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= (MAX_WIDTH / width);
      width = MAX_WIDTH;
    }
  } else if (height > MAX_HEIGHT) {
    width *= (MAX_HEIGHT / height);
    height = MAX_HEIGHT;
  }
  return { width, height };
}

export default function resizeImageOnCanvas(
  imageRef: RefObject<HTMLImageElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
) {
  if (!canvasRef.current || !imageRef.current) {
    throw new Error('Could not get canvas or image ref');
  }
  const image = imageRef.current;
  const { width, height } = getWidthAndHeight(image);
  const canvas = canvasRef.current;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  ctx.drawImage(imageRef.current, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg');
  return dataUrl;
}
