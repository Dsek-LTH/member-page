import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { category, meeting, title } = req.query;
  const form = new formidable.IncomingForm({ keepExtensions: true });
  const file: formidable.File | formidable.File[] = await new Promise((resolve, reject) => {
    form.parse(req, (err, _, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files?.file);
      }
    });
  });
  if (Array.isArray(file)) {
    return res.status(400).json({ error: 'Only one file can be uploaded at a time' });
  }

  const result = await cloudinary.uploader.upload(file.filepath, { public_id: `documents/${category}/${meeting}/${title}` });
  return res.status(200).json(
    { result },
  );
}
