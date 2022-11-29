import { NextApiRequest, NextApiResponse } from 'next';
import {
  ApolloClient, createHttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { MeHeaderDocument, MeHeaderQuery } from '~/generated/graphql';
import blockedIDs from '~/data/blockedIDs';
import { MAX_MESSAGE_LENGTH } from '~/data/boss';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(404);
  }

  const {
    message, red, green, blue, authToken,
  } = JSON.parse(req.body);
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

  const { data } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });

  const id = data?.me?.student_id;
  const name = data?.me?.first_name;
  if (!id || !name) {
    return res.status(500).json({ success: false, message: 'Student id not found (try reloading the page)' });
  }

  if (blockedIDs.has(id)) {
    return res.status(500).json({ success: false, message: 'Tried sending to soon!' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(500).json({ success: false, message: 'Message too long!' });
  }

  blockedIDs.add(id);
  setTimeout(() => blockedIDs.delete(id), process.env.SANDBOX === 'true' ? 5000 : 1000 * 60);

  const sentMessage = `${message} //${name}`;
  // eslint-disable-next-line no-console
  console.log(`boss: ${id} sent message ${sentMessage}`);
  const response = await fetch(`http://192.168.7.170:8080/sendText?message=${sentMessage}&color=${red},${green},${blue}`, { method: 'POST' });
  return res.status(200).json({ success: response.ok, message: sentMessage });
}
