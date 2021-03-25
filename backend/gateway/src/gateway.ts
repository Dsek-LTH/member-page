import express from 'express';
import jwtDecode from 'jwt-decode';

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
    return (url && name) ? {url, name} : undefined;
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

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({req}) => {
    if (!req.headers.authorization) return {}

    const token = req.headers.authorization || '';
    const decodedToken = jwtDecode<KeycloakToken & OpenIdToken>(token);

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

app.use('/static', express.static('../static-content'))

apolloServer.applyMiddleware({ app });


app.listen(4000, () => console.log(`Gateway listening at http://localhost:4000`))