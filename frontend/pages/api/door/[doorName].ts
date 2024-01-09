/* eslint-disable max-len */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import
{
  DoorAccessDocument, DoorAccessQuery,
} from '~/generated/graphql';

// This needs to be updated at the turn of every year, and it is chosen by the KM
// Do not edit it without consulting the KM
const BACKUP_LIST_OF_STUDENT_IDS = [
  'em5261ha-s', // Ordförande, Emma Haggren
  'ph3883ni-s', // KM, Philip Nielsen
  'es1767st-s', // root, Esbjörn Stenberg
  'ad2313ad-s', // DWWW-ansvarig, Daniel Adu-Gyan
  'da6673he-s', // Informationsansvarig, Dag Hemberg
  'fe0024vi-s', // Skattmästare, Felix Vigren
  'ol1662le-s', // Revisor, Oliver Levay
  'al6271gr-s', // Revisor, Alfred Grip
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const doorName = req.query.doorName as string;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  try {
    const { data } = await client.query<DoorAccessQuery>({
      query: DoorAccessDocument,
      variables: { name: doorName },
    });
    /*
    const { data: permanentMembersData } = await client
      .query<GetPermanentDoorMembersQuery>({ query: GetPermanentDoorMembersDocument });

    const studentIds = permanentMembersData.mandatePagination.mandates.map((mandate) => mandate.member.student_id
    */
    const studentIds = [...BACKUP_LIST_OF_STUDENT_IDS];
    if (!data.door) {
      return res.status(200).end(studentIds.join('\n'));
    }

    studentIds.push(...data.door.studentIds);
    const uniqueStudentIds = Array.from(new Set(studentIds));
    uniqueStudentIds.sort();
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).end(uniqueStudentIds.join('\n'));
  } catch (e) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).end(BACKUP_LIST_OF_STUDENT_IDS.join('\n'));
  }
}
