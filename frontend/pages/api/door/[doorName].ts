import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const doorName = req.query.doorName as string;

  const query = gql`query DoorAccess($name: String!) {
    door(name: $name) {
      studentIds
    }
  }`;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data, error } = await client.query({
    query,
    variables: { name: doorName },
  })

  if (!data.door) {
    return res.status(404).end();
  }
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).end(data.door.studentIds.join('\n'));
}
