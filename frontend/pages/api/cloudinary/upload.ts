import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import checkAccess from '~/functions/checkAccess';

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

  // Check for fileHandler:documents:create permission
  if (!(await checkAccess(req, 'fileHandler:documents:create'))) {
    return res.status(403).json({ error: 'Access denied' });
  }

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

  const result = await cloudinary.uploader.upload(file.filepath, { public_id: `documents/${category}/${meeting}/${title}`, unique_filename: false });
  return res.status(200).json(
    { result },
  );
}
