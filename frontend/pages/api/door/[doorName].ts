/* eslint-disable max-len */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  DoorAccessDocument, DoorAccessQuery, GetPermanentDoorMembersDocument, GetPermanentDoorMembersQuery,
} from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const doorName = req.query.doorName as string;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data } = await client.query<DoorAccessQuery>({
    query: DoorAccessDocument,
    variables: { name: doorName },
  });

  if (!data.door) {
    return res.status(404).end();
  }

  const { data: permanentMembersData } = await client
    .query<GetPermanentDoorMembersQuery>({ query: GetPermanentDoorMembersDocument });
  const studentIds = permanentMembersData.mandatePagination.mandates.map((mandate) => mandate.member.student_id);
  studentIds.push(...data.door.studentIds);
  const uniqueStudentIds = Array.from(new Set(studentIds));
  uniqueStudentIds.sort();
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).end(uniqueStudentIds.join('\n'));
}
