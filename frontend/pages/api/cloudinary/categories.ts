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
  if (!(await checkAccess(req, 'fileHandler:documents:read'))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const result: Result = await cloudinary.api.resources({ type: 'upload', prefix: 'documents' });
  const category_names = Array.from(new Set(result.resources.map((resource) => (resource.public_id.split('/')[1]))));
  return res.status(200).json(
    category_names.sort().reverse(),
  );
}
