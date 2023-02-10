import MeiliSearch from 'meilisearch';
import { NextApiRequest, NextApiResponse } from 'next';
import { MemberHit } from '~/types/MemberHit';

const client = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_MASTER_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }
  const searchQuery = req.query.q as string;
  const escapedQuery = searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  /*   if (process.env.NODE_ENV === 'development') {
    const response = await fetch(`https://member.sandbox.dsek.se/api/search?q=${escapedQuery}`);
    const data = await response.json();
    return res.status(200).json(data);
  }
 */
  const result = await client.index('members').search<MemberHit>(escapedQuery);

  return res.status(200).json(result);
}
