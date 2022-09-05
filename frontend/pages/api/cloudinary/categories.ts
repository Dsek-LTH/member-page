import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dsek',
  api_key: '589734557867947',
  api_secret: 'mr3JVAeiVV06_TRPhsUFsQJURnQ',
  secure: true,
});

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
  const result: Result = await cloudinary.api.resources({ type: 'upload', prefix: 'documents' });
  const category_names = Array.from(new Set(result.resources.map((resource) => (resource.public_id.split('/')[1]))));
  return res.status(200).json(
    category_names.sort().reverse(),
  );
}
