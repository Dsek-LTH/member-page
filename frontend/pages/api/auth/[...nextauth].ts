/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions, TokenSet } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

const keycloak = KeycloakProvider({
  clientId: process.env.KEYCLOAK_ID,
  clientSecret: process.env.KEYCLOAK_SECRET,
  issuer: process.env.KEYCLOAK_ISSUER,
});

class RefreshAccessTokenError extends Error {
  tokens: TokenSet;

  constructor(tokens: TokenSet | undefined) {
    super('RefreshAccessTokenError');
    this.tokens = tokens;
  }
}

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
    const url = `${keycloak.options.issuer}/protocol/openid-connect/token`;

    const response = await fetch(url, {
      method: 'POST',
      body: new URLSearchParams({
        client_id: keycloak.options.clientId,
        client_secret: keycloak.options.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens: TokenSet = await response.json();

    if (!response.ok) {
      throw new RefreshAccessTokenError(refreshedTokens);
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      // Fall back to old refresh token
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

/**
 *
 * @param jwt This performs the final handshake for the keycloak provider.
 * The way it's written it could also potentially
 * perform the action for other providers as well
 */
async function doFinalSignoutHandshake(jwt: JWT) {
  const { idToken } = jwt;

  try {
    // Add the id_token_hint to the query string
    const params = new URLSearchParams();
    params.append('id_token_hint', idToken as string);
    const response = await fetch(`${keycloak.options.issuer}/protocol/openid-connect/logout?${params.toString()}`);
    if (response.ok) {
      // eslint-disable-next-line no-console
      console.log('Completed post-logout handshake');
    } else {
      // eslint-disable-next-line no-console
      console.error('Unable to perform post-logout handshake');
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('Unable to perform post-logout handshake', e);
  }
}
export const authOptions: AuthOptions = {
  providers: [
    keycloak,
  ],
  callbacks: {
    async jwt({
      token, account, profile,
    }) {
      // Right after sign in, persist the OAuth access_token to the token
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
      }
      if (profile) {
        token.given_name = profile.given_name;
        token.family_name = profile.family_name;
        token.preferred_username = profile.preferred_username;
      }
      if (Date.now() < token.expiresAt * 1000) {
        // If the access token has not expired yet, return it
        return token;
      }

      // If the access token has expired, try to refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      // session.idToken = token.idToken;
      // session.refreshToken = token.refreshToken;
      session.user.firstName = token.given_name;
      session.user.lastName = token.family_name;
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
