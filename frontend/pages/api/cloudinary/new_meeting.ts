import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { category, title } = req.query;
  const result = await cloudinary.uploader.upload('https://res.cloudinary.com/dsek/image/upload/v1662413284/blob.png', { public_id: `documents/${category}/${title}/blob.png` });
  return res.status(200).json(
    result,
  );
}
