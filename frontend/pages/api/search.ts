import MeiliSearch from 'meilisearch';
import { NextApiRequest, NextApiResponse } from 'next';
import { MemberHit } from '~/types/MemberHit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const searchQuery = req.query.q as string;
  console.log(searchQuery);

  const client = new MeiliSearch({
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_MASTER_KEY,
  });

  const result = await client.index('members').search<MemberHit>(searchQuery);

  return res.status(200).json(result);
}
