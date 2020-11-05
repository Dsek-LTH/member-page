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

    const getUser = (): context.User => {
      const token = req.headers.authorization || '';
      const decodedToken = jwtDecode<KeycloakToken>(token);
      return {
        keycloak_id: decodedToken.sub,
        student_id: decodedToken.preferred_username,
        name: decodedToken.name,
      }
    }
    const user = getUser();
    const roles = await context.getRoles(user.student_id);
    const c: context.UserContext = {
      user,
      roles,
    };
    return c;
  }
});

app.use('/static', express.static('../static-content'))

apolloServer.applyMiddleware({ app });


app.listen(4000, () => console.log(`Gateway listening at http://localhost:4000`))