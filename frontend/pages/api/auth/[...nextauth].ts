/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

const keycloak = KeycloakProvider({
  clientId: process.env.KEYCLOAK_ID,
  clientSecret: process.env.KEYCLOAK_SECRET,
  issuer: process.env.KEYCLOAK_ISSUER,
  accessTokenUrl: `${process.env.KEYCLOAK_ISSUER}/token`,
  authorization: `${process.env.KEYCLOAK_ISSUER}/auth`,
  requestTokenUrl: `${process.env.KEYCLOAK_ISSUER}/auth`,
  profileUrl: `${process.env.KEYCLOAK_ISSUER}/userinfo`,
});

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
/**
 * @param  {JWT} token
 */
const refreshAccessToken = async (token: JWT) => {
  try {
    if (Date.now() > token.refreshTokenExpired) throw Error('Token is not expired');
    const details = {
      client_id: keycloak.options.clientId,
      client_secret: keycloak.options.clientSecret,
      grant_type: ['refresh_token'],
      refresh_token: token.refreshToken,
    };
    const formBody: string[] = [];
    Object.entries(details).forEach(([key, value]: [string, any]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(`${encodedKey}=${encodedValue}`);
    });
    const formData = formBody.join('&');
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    });
    const refreshedTokens = await response.json();
    if (!response.ok) throw new Error(`${response.status}, ${response.statusText}, ${refreshedTokens}`);
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpired: Date.now() + (refreshedTokens.expires_in - 15) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      refreshTokenExpired:
        Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ error: JSON.stringify(error) });
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

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
        token.refreshToken = account.refresh_token;
        token.accessTokenExpired = Date.now() + (account.expires_in - 15) * 1000;
        token.refreshTokenExpired = Date.now() + (account.refresh_expires_in - 15) * 1000;
      }
      if (profile) {
        token.given_name = profile.given_name;
        token.family_name = profile.family_name;
        token.preferred_username = profile.preferred_username;
      }
      if (Date.now() < token.accessTokenExpired) return token;
      return refreshAccessToken(token);
      // Return previous token if the access token has not expired yet

      // Access token has expired, try to update it
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.idToken = token.idToken;
      // @ts-ignore
      session.refreshToken = token.refreshToken;
      // @ts-ignore
      session.user.firstName = token.given_name;
      // @ts-ignore
      session.user.lastName = token.family_name;
      // @ts-ignore
      session.user.studentId = token.preferred_username;
      session.error = token.error;
      return session;
    },
  },
  events: {
    signOut: ({ token }) => doFinalSignoutHandshake(token),
  },
};
export default NextAuth(authOptions);
