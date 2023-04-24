import React, { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import GraphQLProvider from '~/providers/GraphQLProvider';

type LoginProviderProps = PropsWithChildren<{ session: any }>;

function LoginProvider({ children, session }: LoginProviderProps) {
  return (
    <SessionProvider session={session}>
      <GraphQLProvider>
        {children}
      </GraphQLProvider>
    </SessionProvider>
  );
}

export default LoginProvider;
