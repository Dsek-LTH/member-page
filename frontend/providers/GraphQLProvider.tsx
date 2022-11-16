import React, {
  useEffect, useState, PropsWithChildren,
} from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider,
} from '@apollo/client';
import { MeHeaderDocument, MeHeaderQuery } from '~/generated/graphql';
import { createSpicyApolloClient } from '~/apolloClient';

type GraphQLProviderProps = PropsWithChildren<{ ssrToken: string }>;

function GraphQLProvider({
  children,
  ssrToken,
}: GraphQLProviderProps) {
  const { keycloak, initialized } = useKeycloak();
  const [client, setClient] = useState(createSpicyApolloClient(keycloak));

  useEffect(() => {
    async function checkIfTokenExpired() {
      const { data } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });
      return !data?.me;
    }
    // logged out but still has a token
    if (initialized && !keycloak.authenticated && ssrToken) {
      setClient(createSpicyApolloClient(keycloak));
    } else if (initialized && keycloak?.token) {
      checkIfTokenExpired().then((isExpired) => {
        if (isExpired) {
          setClient(createSpicyApolloClient(keycloak));
        }
      });
    }
  }, [keycloak.authenticated, keycloak?.token, ssrToken, initialized]);

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}

export default GraphQLProvider;
