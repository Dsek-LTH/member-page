import React from 'react';

import { useKeycloak } from '@react-keycloak/web';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

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