import { knex } from 'dsek-shared';

import createApolloServer from '../src/server';

import { ApolloServer } from 'apollo-server';
import { DataSources } from '../src/datasources';
import PositionAPI from '../src/datasources/Position';
import MemberAPI from '../src/datasources/Member';
import CommitteeAPI from '../src/datasources/Committee';
import MandateAPI from '../src//datasources/Mandate';

export const constructTestServer = (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    positionAPI: new PositionAPI(knex),
    memberAPI: new MemberAPI(knex),
    committeeAPI: new CommitteeAPI(knex),
    mandateAPI: new MandateAPI(knex),
  }
  return {
    server: createApolloServer(context, () => dataSources),
    context: context,
    dataSources: dataSources,
  }
}
