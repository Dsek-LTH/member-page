import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jwtDecode from 'jwt-decode';

import { serviceList } from './services/services';
import { User, Role, UserContext, getRoles } from './context';

import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLRequest } from 'apollo-server-core';

import knex from './database';
const setup = require('./database-setup');
setup(knex);

const app = express();
const port = process.env.GATEWAY_PORT;

const gateway = new ApolloGateway({
  serviceList: serviceList,
  buildService: ({ url }) => {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }: { request: GraphQLRequest, context: {user: any, roles: any}}) {
        if (request.http) {
          request.http.headers.set('x-user', JSON.stringify(context.user));
          request.http.headers.set('x-roles', JSON.stringify(context.roles));
        }
      }
    })
  }
});

interface KeycloakToken {
  sub: string,
  preferred_username?: string,
  name?: string,
}

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({req}) => {
    if (!req.headers.authorization) return {}

    const getUser = (): User => {
      const token = req.headers.authorization || '';
      const decodedToken = jwtDecode<KeycloakToken>(token);
      return {
        keycloak_id: decodedToken.sub,
        stil_id: decodedToken.preferred_username,
        name: decodedToken.name,
      }
    }
    const user = getUser();
    const roles = await getRoles(user.stil_id);
    const context: UserContext = {
      user,
      roles,
    };
    return context;
  }
});

apolloServer.applyMiddleware({ app });


app.listen(port, () => console.log(`Gateway listening at http://localhost:${port}`))