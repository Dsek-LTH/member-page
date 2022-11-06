import React, { useEffect, useState, PropsWithChildren } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import { MeHeaderDocument } from '~/generated/graphql';
import routes from '~/routes';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
  const [originalSsrToken] = useState(ssrToken);
  const router = useRouter();
  const { keycloak } = useKeycloak();
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
    // Just logged out
    if ((originalSsrToken && !ssrToken) || (ssrToken && !keycloak.authenticated)) {
      setClient(new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
      }));
    }

    // Just logged in
    if (!ssrToken && keycloak.token) {
      const newClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
      });
      newClient.query({ query: MeHeaderDocument }).then(({ data }) => {
        if (!data.me) {
          router.push(routes.onboarding);
        }
      });
      setClient(newClient);
    }
  }, [keycloak.token, ssrToken, originalSsrToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default GraphQLProvider;
