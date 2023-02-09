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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          preferred_username: profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({
      token, account, profile,
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (profile) {
        token.given_name = profile.given_name;
        token.family_name = profile.family_name;
        token.preferred_username = profile.preferred_username;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.idToken = token.idToken;
      // @ts-ignore
      session.user.firstName = token.given_name;
      // @ts-ignore
      session.user.lastName = token.family_name;
      // @ts-ignore
      session.user.studentId = token.preferred_username;
      return session;
    },
  },
};
export default NextAuth(authOptions);
