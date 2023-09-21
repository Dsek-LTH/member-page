/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ApolloClient, createHttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  MeHeaderDocument, MeHeaderQuery, ApiAccessQuery, ApiAccessDocument,
} from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(404);
  }
  let studentId;
  let name;
  const {
    red, blue, green, white_up, white_down, authToken,
  } = JSON.parse(req.body);
  if (process.env.NODE_ENV === 'development') {
    studentId = 'ol1662le-s';
    name = 'Oliver';
  } else {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    }));

    const client = new ApolloClient({
      ssrMode: true,
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          errorPolicy: 'all',
        },
      },
    });

    const [accessResult, userResult] = await Promise.all([
      client.query<ApiAccessQuery>({ query: ApiAccessDocument }),
      client.query<MeHeaderQuery>({ query: MeHeaderDocument }),
    ]);

    const accessData = accessResult.data;
    const userData = userResult.data;

    if (!accessData?.apiAccess.map((el) => el.name).includes('lights:change')) {
      return res.status(500).json({ sent: false, status: 'You do not have access to change the lights' });
    }

    studentId = userData?.me?.student_id;
    name = userData?.me?.first_name;
  }
  if (!studentId || !name) {
    return res.status(500).json({ sent: false, status: 'Student id not found (try reloading the page)' });
  }

  console.log(`blajt: ${studentId} changed color to red:${red} green:${green} blue:${blue} white_up:${white_up} white_down:${white_down}`);
  let sent = false;
  let status;
  try {
    if (process.env.NODE_ENV !== 'development') {
      const response = await fetch('http://blajt:8080/set_all_colors', {
        method: 'POST',
        body: new URLSearchParams({
          red,
          green,
          blue,
          white_down,
          white_up,
        }),
      });
      if (response.ok) {
        status = 'Successfully updated lights';
        sent = true;
      }
    } else {
      throw new Error('Not sending to blajt in development');
    }
  } catch (e) {
    console.error(e);
    status = e.message;
    sent = false;
  }

  return res.status(200).json({
    sent,
    status,
  });
}
