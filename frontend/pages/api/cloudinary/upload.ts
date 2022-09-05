import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import asyncBusboy from 'async-busboy';

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
  const { files } = await asyncBusboy(req);
  const result = await cloudinary.uploader.upload(files[0].path, { public_id: `documents/${category}/${meeting}/${title}` });
  return res.status(200).json(
    { result },
  );
}
