import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

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
  const public_id = req.query.public_id as string;
  if (public_id) {
    const result: Result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json(
      result,
    );
  }

  return res.status(500).json({ error: 'You have to send a public_id' });
}
