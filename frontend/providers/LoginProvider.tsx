import React from 'react';
import cookie from 'cookie'
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr';
import type { IncomingMessage } from 'http'
import type { AppContext } from 'next/app'


const keycloakConfig = {
  clientId: 'dsek-se-openid',
  realm: 'dsek',
  url: 'https://portal.dsek.se/auth/'
}

const initOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: `${process.env.NEXT_PUBLIC_FRONTEND_ADDRESS}/silent-check-sso.html`
};

const LoginProvider = ({children, cookies}) => {
  return (
    <SSRKeycloakProvider keycloakConfig={keycloakConfig} initOptions={initOptions} persistor={SSRCookies(cookies)}>
      {children}
    </SSRKeycloakProvider>
  )
}

function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {}
  }
  return cookie.parse(req.headers.cookie || '')
}
 
LoginProvider.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  return {
    cookies: parseCookies(context?.ctx?.req)
  }
}

export default LoginProvider;
