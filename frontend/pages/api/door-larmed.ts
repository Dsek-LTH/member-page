/* eslint-disable max-len */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  AlarmShouldBeActiveDocument,
  AlarmShouldBeActiveQuery,
} from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });
  const { data } = await client.query<AlarmShouldBeActiveQuery>({
    query: AlarmShouldBeActiveDocument,
  });

  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).end(data.alarmShouldBeActive ? 'true' : 'false');
}
