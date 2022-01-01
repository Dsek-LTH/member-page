import React, { useEffect, useState, PropsWithChildren } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import { MeHeaderDocument } from '~/generated/graphql';
import routes from '~/routes';

const apolloLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

const createAuthLink = (token) => setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
  },
}));

const createClient = (token) => new ApolloClient({
  cache: new InMemoryCache(),
  link: createAuthLink(token).concat(apolloLink),
});

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
  const router = useRouter();
  const [client, setClient] = useState(createClient(ssrToken));
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (!ssrToken && keycloak.token) {
      const newClient = createClient(keycloak.token);
      newClient.query({ query: MeHeaderDocument }).then(({ data }) => {
        if (!data.me) {
          router.push(routes.onboarding);
        }
      });
      setClient(newClient);
    }
  }, [keycloak.token, router, ssrToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default GraphQLProvider;
