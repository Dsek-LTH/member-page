/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const keycloakConfig = {
  clientId: 'dsek-se-openid',
  realm: 'dsek',
  url: 'https://portal.dsek.se/auth/',
};

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.idToken = token.idToken;
      return session;
    },
  },
};
export default NextAuth(authOptions);
