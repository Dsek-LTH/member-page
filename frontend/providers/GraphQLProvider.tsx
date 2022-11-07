import React, {
  useEffect, useState, PropsWithChildren,
} from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
  const [recreatedClient, setRecreatedClient] = useState(false);
  const { keycloak, initialized } = useKeycloak();
  const authLink = setContext((_, { headers }) => {
    let { token } = keycloak;
    if (!token) {
      token = ssrToken;
    }
    return ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  });
  const [client, setClient] = useState(new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, httpLink]),
  }));

  useEffect(() => {
    if (recreatedClient) {
      return;
    }
    // logged out but still has a token
    if (initialized && !keycloak.authenticated && ssrToken) {
      setClient(new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
      }));
      setRecreatedClient(true);
    }

    // logged in with token missmatch
    if (keycloak?.token && ssrToken.slice(0, 100) !== keycloak?.token?.slice(0, 100)) {
      const newClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
      });
      setClient(newClient);
      setRecreatedClient(true);
    }
  }, [keycloak.authenticated, keycloak?.token, ssrToken, recreatedClient, initialized, authLink]);

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}

export default GraphQLProvider;
