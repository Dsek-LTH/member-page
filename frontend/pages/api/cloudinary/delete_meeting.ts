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
  const { category, meeting } = req.query;
  if (category && meeting) {
    const result: Result = await cloudinary.api.delete_resources_by_prefix(`documents/${category}/${meeting}`);
    return res.status(200).json(
      result,
    );
  }

  return res.status(500).json({ error: 'You need a category and a meeting' });
}
