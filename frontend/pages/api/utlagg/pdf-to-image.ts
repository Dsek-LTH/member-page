// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import pdf2img from 'pdf-img-convert';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filePath = await new Promise<string>((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (!files.file) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('No file');
      }
      if (files.file) {
        resolve(files.file[0].filepath);
      }
    });
  });

  const result: Uint8Array[] = (await pdf2img.convert(
    filePath,
  )) as unknown as Uint8Array[];
  const content = result[0];

  const blob = new Blob([content.buffer], { type: 'image/png' } /* (1) */);

  const uri = URL.createObjectURL(blob);
  res.status(200).json({
    base64: uri,
  });

  // res.status(200).json({ name: 'John Doe' });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
