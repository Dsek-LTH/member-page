import jwt from 'jsonwebtoken';
import { createLogger } from './shared';

// axiosRetry(axios, { retries: 100, retryDelay: (count) => count * 500 });

/*
 * The following interfaces are what data the keycloak token includes.
 *
 * OpenIdToken is defined at https://openid.net/specs/openid-connect-core-1_0.html#IDToken.
 * KeycloakToken is created by inspecting a token from our keycloak instance.
 *
 * Most of these field most likely wont be used.
 */
interface OpenIdToken {
  iss: string,
  sub: string, // User id
  aud: string[],
  exp: number,
  iat: number,
  auth_time?: number,
  nonce?: string,
  acr?: string,
  amr?: string[],
  azp?: string,
}

interface KeycloakToken {
  jti?: string,
  nbf?: number,
  typ?: string,
  session_state?: string,
  'allowed-origins'?: string[],
  realm_access?: {
    roles?: string[], // What roles a user has
  },
  resource_access?: {
    'realm-management'?: {
      roles?: string[],
    },
    account?: {
      roles?: string[],
    },
  },
  scope?: string,
  email_verified?: boolean,
  name?: string,
  preferred_username?: string, // Most likely their student id
  given_name?: string,
  family_name?: string,
  email?: string,
  group: string[],
}

const keycloakAddress = 'https://portal.dsek.se/realms/dsek/';
let pem = '';

const logger = createLogger('verifyAndDecodeToken');

async function getPem() {
  while (!pem) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(keycloakAddress);
      // eslint-disable-next-line no-await-in-loop
      const data = await res.json();
      pem = `-----BEGIN PUBLIC KEY-----\n${data.public_key}\n-----END PUBLIC KEY-----`;
      logger.info(`Successfully fetched public key from ${keycloakAddress}`);
    } catch (err) {
      logger.error('Failed to fetch public key, trying again!');
      logger.error(err);
    }
  }
}

getPem();

export type DecodedToken = KeycloakToken & OpenIdToken | undefined;

export default async function verifyAndDecodeToken(token: string): Promise<DecodedToken> {
  // console.log({ token, pem });
  try {
    return jwt.verify(token, pem) as KeycloakToken & OpenIdToken;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error({ error: e, token, pem });
    return undefined;
  }
}
