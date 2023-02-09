/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

const keycloak = KeycloakProvider({
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
});

// this performs the final handshake for the keycloak
// provider, the way it's written could also potentially
// perform the action for other providers as well
async function doFinalSignoutHandshake(jwt: JWT) {
  const { idToken } = jwt;

  try {
    // Add the id_token_hint to the query string
    const params = new URLSearchParams();
    params.append('id_token_hint', idToken as string);
    const response = await fetch(`${keycloak.options.issuer}/protocol/openid-connect/logout?${params.toString()}`);
    const { status, statusText } = await response.json();
    // The response body should contain a confirmation that the user has been logged out
    // eslint-disable-next-line no-console
    console.log('Completed post-logout handshake', status, statusText);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('Unable to perform post-logout handshake', e);
  }
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    keycloak,
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
  events: {
    signOut: ({ token }) => doFinalSignoutHandshake(token),
  },
};
export default NextAuth(authOptions);
