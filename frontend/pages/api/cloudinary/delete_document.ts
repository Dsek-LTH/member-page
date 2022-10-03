import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import checkAccess from '~/functions/checkAccess';

type Resource = {
  public_id: string,
  folder: string,
  url: string,
}

type Result = {
  resources: Resource[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check for fileHandler permission
  if (!(await checkAccess(req, 'fileHandler:documents:delete'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const public_id = req.query.public_id as string;
  if (public_id) {
    const result: Result = await cloudinary.uploader.rename(public_id, `deleted/${public_id}`);
    return res.status(200).json(
      result,
    );
  }

  return res.status(500).json({ error: 'You have to send a public_id' });
}
