import React, { PropsWithChildren } from 'react';
import cookie from 'cookie';
/**
 * @TODO Migrate to nextauth https://next-auth.js.org/providers/keycloak
 */
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr';
import type { AuthClientInitOptions } from '@react-keycloak/core';
import type { IncomingMessage } from 'http';
import type { AppContext } from 'next/app';
import type { KeycloakConfig } from 'keycloak-js';
import { NormalizedCacheObject } from '@apollo/client';
import GraphQLProvider from '~/providers/GraphQLProvider';

const keycloakConfig: KeycloakConfig = {
  clientId: 'dsek-se-openid',
  realm: 'dsek',
  url: 'https://portal.dsek.se/auth/',
};

const initOptions: AuthClientInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: `${process.env.NEXT_PUBLIC_FRONTEND_ADDRESS}/silent-check-sso.html`,
};

type LoginProviderProps = PropsWithChildren<{ cookies: any, apolloCache: NormalizedCacheObject }>;

function LoginProvider({ children, cookies, apolloCache }: LoginProviderProps) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakConfig}
      initOptions={initOptions}
      persistor={SSRCookies(cookies)}
    >
      <GraphQLProvider
        ssrApolloCache={apolloCache}
        ssrToken={SSRCookies(cookies).getTokens().token}
      >
        {children}
      </GraphQLProvider>
    </SSRKeycloakProvider>
  );
}

function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {};
  }
  return cookie.parse(req.headers.cookie || '');
}

LoginProvider.getInitialProps = async (context: AppContext) =>
  // Extract cookies from AppContext
  ({
    cookies: parseCookies(context?.ctx?.req),
  });
export default LoginProvider;
