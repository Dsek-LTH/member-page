import React, {
  PropsWithChildren, useEffect, useState,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  ApolloProvider,
} from '@apollo/client';
import { createSpicyApolloClient } from '~/apolloClient';
import { MeHeaderQuery, MeHeaderDocument } from '~/generated/graphql';

type GraphQLProviderProps = PropsWithChildren<{}>;

function GraphQLProvider({ children }: GraphQLProviderProps) {
  const { data: session, status } = useSession();

  // create client on first render
  const [client, setClient] = useState(createSpicyApolloClient(session));

  useEffect(() => {
    async function hasValidToken() {
      const { data: userData } = await client.query<MeHeaderQuery>({ query: MeHeaderDocument });
      return !!userData?.me;
    }

    if (status === 'authenticated' && session?.accessToken) {
      hasValidToken().then((valid) => {
        if (!valid) {
          setClient(createSpicyApolloClient(session));
        }
      });
    }
  }, [session, status]); // eslint-disable-line react-hooks/exhaustive-deps
  // DO NOT ADD CLIENT TO DEPENDENCIES, THIS WILL CAUSE AN INFINITE LOOP

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}

export default GraphQLProvider;
