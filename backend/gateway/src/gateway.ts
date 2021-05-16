import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLRequest } from 'apollo-server-core';

import { context } from 'dsek-shared';

const app = express();

type service = {url: string, name: string};

const createServiceList = (): service[] => {
  const arr: service[] = [];
  let i = 0;

  const nextService = (): service | undefined => {
    const url = process.env[`URL_${i}`];
    const name = process.env[`NAME_${i}`];
    i++;
    return (url && name) ? {url: url + 'graphql', name} : undefined;
  }
  let service = nextService();


  while (service) {
    arr.push(service);
    service = nextService();
  }
  return arr;
}

const gateway = new ApolloGateway({
  serviceList: createServiceList(),
  buildService: ({ url }) => {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }: { request: GraphQLRequest, context: context.UserContext}) {
        if (request.http) {
          if (context.user) request.http.headers.set('x-user', JSON.stringify(context.user));
          if (context.roles) request.http.headers.set('x-roles', JSON.stringify(context.roles));
        }
      }
    })
  }
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

let pemCache: string | undefined = undefined;
const pemCacheTtl = 60 * 1000;
const keycloakAddress = 'https://portal.dsek.se/auth/realms/dsek/';

const verifyAndDecodeToken = async (token: string): Promise<KeycloakToken & OpenIdToken | undefined> => {
  let pem = pemCache; // To avoid race conditions
  if (!pem) {
    const res = await axios.get(keycloakAddress);
    const key = res.data.public_key;
    pemCache = "-----BEGIN PUBLIC KEY-----\n" + key + "\n-----END PUBLIC KEY-----";
    pem = pemCache;
    new Promise<void>(resolve => setTimeout(() => {pemCache = undefined; resolve()}, pemCacheTtl))
  }

  try {
    return jwt.verify(token, pem) as KeycloakToken & OpenIdToken;
  } catch (e) {
    return undefined;
  }
}

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({req}) => {
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
  }
});

apolloServer.applyMiddleware({ app });

const start = async () => {
  for (let i = 1; i <= 10; i++) {
    try {
      // Checks if all services are up
      await Promise.all(
        Object.keys(process.env)
          .filter(k => k.includes('URL') && !k.includes('DB'))
          .map(k => process.env[k] + '.well-known/apollo/server-health')
          .map(url => axios.post(url, {query: `{}`}))
      );
      console.log(`Try ${i} to connect to the services was successful`);
      break;
    } catch (e) {
      console.log(`Try ${i} to connect to the services failed`);
      const timeout = 500 * i;
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }
  console.log('Starting gateway...')
  app.listen(4000, () => console.log(`Gateway started`))
}

start();