import { PropsWithChildren, ReactNode, useMemo } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

export default function ApolloProviderWrapper({ children }: PropsWithChildren<ReactNode>) {
  const client = useMemo(() => {
    const authMiddleware = setContext(async (operation, { headers }) => {
      const { accessToken } = await fetch('/api/auth/session').then((res) => res.json());

      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    });

    return new ApolloClient({
      link: from([authMiddleware, httpLink]),
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
