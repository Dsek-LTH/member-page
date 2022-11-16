import React, {
  useEffect, useState, PropsWithChildren,
} from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import {
  ApolloProvider, NormalizedCacheObject,
} from '@apollo/client';
import { MeHeaderDocument, MeHeaderQuery } from '~/generated/graphql';
import { createApolloClient, createSpicyApolloClient } from '~/apolloClient';

type GraphQLProviderProps = PropsWithChildren<{
  ssrToken: string,
  ssrApolloCache: NormalizedCacheObject
}>;

function GraphQLProvider({
  children,
  ssrToken,
  ssrApolloCache,
}: GraphQLProviderProps) {
  const [apolloCache] = useState(ssrApolloCache);
  const { keycloak, initialized } = useKeycloak();
  const [client, setClient] = useState(createSpicyApolloClient(keycloak, apolloCache));
  useEffect(() => {
    async function checkIfTokenExpired() {
      const { data } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });
      return !data?.me;
    }
    // logged out but still has a token
    if (initialized && !keycloak.authenticated && ssrToken) {
      setClient(createApolloClient());
    } else if (initialized && keycloak?.token) {
      checkIfTokenExpired().then((isExpired) => {
        if (isExpired) {
          setClient(createSpicyApolloClient(keycloak, apolloCache));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ssrToken, initialized, keycloak]);
  // DO NOT ADD CLIENT TO DEPENDENCIES, THIS WILL CAUSE AN INFINITE LOOP

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}

export default GraphQLProvider;
