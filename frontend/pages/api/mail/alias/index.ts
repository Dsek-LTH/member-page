import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResolveRecipientsEmailDocument, ResolveRecipientsEmailQuery } from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const mail = req.query.mail as string;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data } = await client.query<ResolveRecipientsEmailQuery>({
    query: ResolveRecipientsEmailDocument,
    variables: { alias: mail },
  });
  res.setHeader('Content-Type', 'text/plain');
  const recipients = data.resolveRecipients.map((r) => {
    const emails = r.emailUsers.map((u) => u.email).filter((e) => !!e)
      .filter((v, i, a) => a.indexOf(v) === i);
    return `${r.alias} ${emails.join(', ')}`;
  });
  const result = recipients.join('\n');
  return res.status(200).end(result);
}
