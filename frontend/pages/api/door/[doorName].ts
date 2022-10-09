/* eslint-disable max-len */
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

  const permanentMembersQuery = gql`query getPermanentDoorMembers {
    mandates (filter: {position_ids: ["dsek.infu.dwww.mastare", "dsek.km.rootm.root", "dsek.ordf", "dsek.km.mastare"], start_date: "2021-12-31"}) {
      mandates {
        member {
          student_id
        }
    }
  }
  }`;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data } = await client.query({
    query,
    variables: { name: doorName },
  });

  if (!data.door) {
    return res.status(404).end();
  }

  const { data: permanentMembersData } = await client.query({ query: permanentMembersQuery });
  const studentIds = permanentMembersData.mandates.mandates.map((mandate) => mandate.member.student_id);
  studentIds.push(...data.door.studentIds);
  const uniqueStudentIds = Array.from(new Set(studentIds));
  uniqueStudentIds.sort();
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).end(uniqueStudentIds.join('\n'));
}
