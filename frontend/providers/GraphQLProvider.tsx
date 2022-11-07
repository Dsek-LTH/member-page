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
import { MeHeaderDocument, MeHeaderQuery } from '~/generated/graphql';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
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
    async function checkIfTokenExpired() {
      const { data } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });
      return !data?.me;
    }
    // logged out but still has a token
    if (initialized && !keycloak.authenticated && ssrToken) {
      setClient(new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
      }));
    } else if (initialized && keycloak?.token) {
      checkIfTokenExpired().then((isExpired) => {
        if (isExpired) {
          const newClient = new ApolloClient({
            cache: new InMemoryCache(),
            link: from([authLink, httpLink]),
          });
          setClient(newClient);
        }
      });
    }
  }, [keycloak.authenticated, keycloak?.token, ssrToken, initialized]);

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}

export default GraphQLProvider;
