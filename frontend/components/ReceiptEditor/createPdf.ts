import { SetStateAction } from 'react';
import { ReceiptEditorData } from 'components/ReceiptEditor';

export type CreatePdfBody = {
  type: string;
  studentId: string;
  fullName: string;
  receiptDatas: ReceiptEditorData[];
};

export default async function createPdf(
  body: CreatePdfBody,
  setProgress: (value: SetStateAction<number>) => void,
  setStatus: (value: string) => void,
) {
  setProgress(0);
  setStatus('creating PDF');
  const interval = setInterval(() => {
    setProgress((prevProgress) => {
      if (prevProgress >= 100) {
        clearInterval(interval);
        return 100;
      }
      return prevProgress + 10;
    });
  }, 450);
  const res = await fetch('/api/utlagg/create-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    const pdf = await res.blob();
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'receipt.pdf';
    link.click();
    setStatus('done');
    setProgress(100);
  } else {
    const error = await res.json();
    setStatus(error.stderr);
    setProgress(100);
  }
}
