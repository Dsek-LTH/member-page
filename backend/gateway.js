const fs = require('fs');
require('dotenv').config();
const express = require('express');
const jwtDecode = require('jwt-decode');
const services = require('./services/index');
const knex = require('./database');
const setup = require('./database-setup');
setup(knex);

const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');

const https = require('https');
const credentials = {
  key: fs.readFileSync(process.env.HTTPS_KEY_PATH, 'utf-8'),
  cert: fs.readFileSync(process.env.HTTPS_CERT_PATH, 'utf-8'),
}

const app = express();
const port = process.env.GATEWAY_PORT;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set('x-user', JSON.stringify(context.user));
    request.http.headers.set('x-roles', JSON.stringify(context.roles));
  }
}

const gateway = new ApolloGateway({
  serviceList: services.serviceList,
  buildService: ({ name, url }) => {
    return new AuthenticatedDataSource({ url });
  }
});

app.get('/', (req, res) => res.send('Hello World!'))

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({req}) => {
    if (!req.headers.authorization)
      return {}

    const getUser = () => {
      const token = req.headers.authorization;
      const decodedToken = jwtDecode(token);
      return {
        keycloak_id: decodedToken.sub,
        stil_id: decodedToken.preferred_username,
        name: decodedToken.name,
      }
    }
    const getRoles = async (stil_id) => {
      const currentDate = (new Date()).toISOString().split("T")[0];
      return await knex('mandates')
        .join('positions', 'mandates.position_title', 'positions.position_title')
        .select('positions.position_title','positions.committee_title')
        .where('stil_id', stil_id)
        .where('start_date', '<=', currentDate)
        .where('end_date', '>=', currentDate)
        .then(rows => {
          return rows
        })
        .catch(e => {
          return []
        })
    }
    const user = getUser();
    const roles = await getRoles(user.stil_id);
    return {
      user,
      roles,
    }
  }
});

apolloServer.applyMiddleware({ app });

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => console.log(`Gateway listening at http://localhost:${port}`))