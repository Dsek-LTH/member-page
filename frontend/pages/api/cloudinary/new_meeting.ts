import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import checkAccess from '~/functions/checkAccess';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check for fileHandler permission
  if (!(await checkAccess(req, 'fileHandler:documents:create'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { category, title } = req.query;
  const result = await cloudinary.uploader.upload('https://res.cloudinary.com/dsek/image/upload/v1662413284/blob.png', { public_id: `documents/${category}/${title}/blob.png` });
  return res.status(200).json(
    result,
  );
}
