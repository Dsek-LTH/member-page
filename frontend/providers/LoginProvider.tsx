import React, { PropsWithChildren } from 'react';
import { NormalizedCacheObject } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import GraphQLProvider from '~/providers/GraphQLProvider';

type LoginProviderProps = PropsWithChildren<{ session: any, apolloCache: NormalizedCacheObject }>;

function LoginProvider({ children, session, apolloCache }: LoginProviderProps) {
  return (
    <SessionProvider session={session}>
      <GraphQLProvider
        ssrApolloCache={apolloCache}
        ssrToken={null}
      >
        {children}
      </GraphQLProvider>
    </SessionProvider>
  );
}

export default LoginProvider;
