import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLRequest } from 'apollo-server-core';

import { context, createLogger } from 'dsek-shared';

const logger = createLogger('gateway');

axiosRetry(axios, { retries: 10, retryDelay: (count) => count * 500 });

const app = express();

type Service = {url: string, name: string};

const createServiceList = (): Service[] => {
  const arr: Service[] = [];
  let i = 0;

  const nextService = (): Service | undefined => {
    const url = process.env[`SERVICE_URL_${i}`];
    const name = process.env[`SERVICE_NAME_${i}`];
    i += 1;
    return (url && name) ? { url: `${url}graphql`, name } : undefined;
  };
  let service = nextService();

  while (service) {
    arr.push(service);
    service = nextService();
  }
  return arr;
};

const gateway = new ApolloGateway({
  serviceList: createServiceList(),
  buildService: ({ url }) => new RemoteGraphQLDataSource({
    url,
    willSendRequest(
      { request, context: ctx }: { request: GraphQLRequest, context: context.UserContext},
    ) {
      if (request.http) {
        if (ctx.user) request.http.headers.set('x-user', JSON.stringify(ctx.user));
        if (ctx.roles) request.http.headers.set('x-roles', JSON.stringify(ctx.roles));
      }
    },
  }),
});

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
}

let pemCache: string | undefined;
const pemCacheTtl = 60 * 1000;
const keycloakAddress = 'https://portal.dsek.se/auth/realms/dsek/';

type Token = KeycloakToken & OpenIdToken | undefined

const verifyAndDecodeToken = async (token: string): Promise<Token> => {
  let pem = pemCache; // To avoid race conditions
  if (!pem) {
    const res = await axios.get(keycloakAddress);
    const key = res.data.public_key;
    pemCache = `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
    pem = pemCache;
    setTimeout(() => { pemCache = undefined; }, pemCacheTtl);
  }

  try {
    return jwt.verify(token, pem) as KeycloakToken & OpenIdToken;
  } catch (e) {
    return undefined;
  }
};

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({ req }) => {
    const { authorization } = req.headers;
    if (!authorization) return undefined;

    const token = authorization.split(' ')[1]; // Remove "Bearer" from token
    const decodedToken = await verifyAndDecodeToken(token);

    if (!decodedToken) return undefined;

    const c: context.UserContext = {
      user: {
        keycloak_id: decodedToken.sub,
        student_id: decodedToken.preferred_username,
        name: decodedToken.name,
      },
      roles: decodedToken.realm_access?.roles,
    };
    return c;
  },
});

apolloServer.applyMiddleware({ app });

const start = async () => {
  logger.info('Checking if services are running');
  const services = Object.keys(process.env).filter((k) => k.includes('SERVICE_URL')).map((k) => `${process.env[k]}graphql?query=%7B__typename%7D`);

  logger.info(`Waiting for services to be ready: ${services.join(', ')}`);
  await Promise.all(services.map((s) => axios.get(s)
    .then(() => logger.info(`Service ${s} is ready`))
    .catch(() => {
      logger.error(`Failed to connect to service ${s}, shutting down...`);
      process.exit(1);
    })))
    .then(() => {
      logger.info('Starting gateway...');
      setTimeout(() => {
        app.listen(4000, () => logger.info('Gateway started'));
      }, 1000);
    });
};

start();
