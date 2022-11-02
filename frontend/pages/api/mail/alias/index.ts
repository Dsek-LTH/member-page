import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResolveRecipientsDocument, ResolveRecipientsQuery } from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const mail = req.query.mail as string;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data } = await client.query<ResolveRecipientsQuery>({
    query: ResolveRecipientsDocument,
    variables: { alias: mail },
  });
  res.setHeader('Content-Type', 'text/plain');
  const result = data.resolveRecipients.map((recipient) => (
    `${recipient.alias}: ${recipient.emails.join(',')}`
  )).join('\n');
  return res.status(200).end(result);
}
