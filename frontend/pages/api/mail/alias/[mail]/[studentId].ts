import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const mail = req.query.mail as string;

  const studentId = req.query.studentId as string;

  const query = gql`
  query userHasAccessToAlias($alias: String!, $student_id: String!) {
    userHasAccessToAlias(alias: $alias, student_id: $student_id) 
  }`;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data } = await client.query({
    query,
    variables: { alias: mail, student_id: studentId },
  });

  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).end(data.userHasAccessToAlias.toString());
}
