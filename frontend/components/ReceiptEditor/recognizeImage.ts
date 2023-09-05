import Tesseract from 'tesseract.js';

export default async function recognizeImage(
  image: Tesseract.ImageLike,
  lang: string,
  setProgress: (value: number) => void,
  setStatus: (value: string) => void,
) {
  return Tesseract.recognize(image, lang, {
    logger: (m) => {
      setProgress(m.progress * 100);
      setStatus(m.status);
    },
  });
}
