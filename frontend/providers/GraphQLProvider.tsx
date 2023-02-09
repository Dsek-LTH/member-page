import React, {
  useEffect, useState, PropsWithChildren,
} from 'react';
import { useSession } from 'next-auth/react';
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
  const { data: session, status } = useSession();
  const [client, setClient] = useState(createSpicyApolloClient(session, apolloCache));
  useEffect(() => {
    async function checkIfTokenExpired() {
      const { data: userData } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });
      return !userData?.me;
    }
    // logged out but still has a token
    if (status === 'unauthenticated' && ssrToken) {
      setClient(createApolloClient());
    } else if (status === 'authenticated' && session?.idToken) {
      checkIfTokenExpired().then((isExpired) => {
        if (isExpired) {
          setClient(createSpicyApolloClient(session));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ssrToken, status, session]);
  // DO NOT ADD CLIENT TO DEPENDENCIES, THIS WILL CAUSE AN INFINITE LOOP

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}

export default GraphQLProvider;
