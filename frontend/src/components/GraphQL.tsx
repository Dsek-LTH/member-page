import React from 'react';

import { useKeycloak } from '@react-keycloak/web';

//GraphQL
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

//Client connected to the back-end gateway
const apolloLink = createHttpLink({
  uri: 'https://localhost:4000/graphql',
});


const GraphQL : React.FC<{}> = (props) => {
  const [keycloak, initialized] = useKeycloak();
  const authLink = setContext((_, { headers }) => {
    const { token } = keycloak;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(apolloLink),
  });
  return (
    <ApolloProvider client={client}>
      {props.children}
    </ApolloProvider>
  );
}

export default GraphQL;