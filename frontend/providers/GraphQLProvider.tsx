import React from 'react';

import { useKeycloak } from '@react-keycloak/ssr';

import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const apolloLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});


const GraphQLProvider: React.FC<{}> = ({children}) => {
  const { keycloak } = useKeycloak();
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: (keycloak?.token) ? `Bearer ${keycloak.token}` : "",
      }
    }
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(apolloLink),
  });
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

export default GraphQLProvider;