import React from 'react';

import { useKeycloak } from '@react-keycloak/ssr';

import {
  ApolloProvider, ApolloClient, createHttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const apolloLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
});

const GraphQLProvider: React.FC<{}> = function ({ children }) {
  const { keycloak } = useKeycloak();
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: (keycloak?.token) ? `Bearer ${keycloak.token}` : '',
    },
  }));

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(apolloLink),
  });
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default GraphQLProvider;
