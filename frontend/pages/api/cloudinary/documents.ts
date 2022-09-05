import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

type Resource = {
  public_id: string,
  folder: string,
  url: string,
}

export type Result = {
  resources: Resource[]
}

type File = {
  title: string;
  secure_url: string;
  public_id: string;
}

type Meeting = {
  title: string;
  files: File[]
}

export type Document = {
  title: string;
  meetings: Meeting[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { prefix } = req.query;
  const result: Result = await cloudinary.api.resources({ type: 'upload', prefix: prefix ? `documents/${prefix}` : 'documents' });
  const category_names = Array.from(new Set(result.resources.map((resource) => (resource.public_id.split('/')[1]))));
  const categories = [];
  category_names.forEach((category, index) => {
    categories.push({ title: category, meetings: [] });
    const meetings = new Set(result.resources.filter((resource) => resource.folder.includes(`/${category}/`)).map((resource) => resource.public_id.split('/')[2]).reverse());
    meetings.forEach((meeting) => {
      categories[index].meetings.push({ title: meeting, files: result.resources.filter((resource) => resource.folder.includes(`/${category}/${meeting}`) && !resource.url.includes('blob.png')).map((resource) => ({ title: resource.public_id.split('/')[3], ...resource })) });
    });
  });

  return res.status(200).json(
    categories,
  );
}
