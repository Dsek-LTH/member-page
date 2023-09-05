import { SetStateAction } from 'react';

export type ReceiptData = {
  total: number;
  vat: number;
  date: string;
  description: string;
  currency: string;
};

export default async function fetchReceiptData(
  text: string,
  setProgress: (value: SetStateAction<number>) => void,
  setStatus: (value: string) => void,
): Promise<ReceiptData> {
  setStatus('awaiting response from ChatGPT');
  setProgress(0);
  // increase progress bar to 100% with 10% every 100ms until 100%
  const interval = setInterval(() => {
    setProgress((prevProgress) => {
      if (prevProgress >= 100) {
        clearInterval(interval);
        return 100;
      }
      return prevProgress + 10;
    });
  }, 200);
  const res = await fetch('/api/utlagg/fetch-receipt-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  clearInterval(interval);
  setStatus('done');
  setProgress(100);
  return parsed;
}
