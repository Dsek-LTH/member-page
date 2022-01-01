import { knex } from 'dsek-shared';

import { ApolloServer } from 'apollo-server';
import createApolloServer from '../src/server';

import { DataSources } from '../src/datasources';
import PositionAPI from '../src/datasources/Position';
import MemberAPI from '../src/datasources/Member';
import CommitteeAPI from '../src/datasources/Committee';
import MandateAPI from '../src/datasources/Mandate';
import AccessAPI from '../src/datasources/Access';

export default (context?: any): {server: ApolloServer, context: any, dataSources: DataSources} => {
  const dataSources: DataSources = {
    positionAPI: new PositionAPI(knex),
    memberAPI: new MemberAPI(knex),
    committeeAPI: new CommitteeAPI(knex),
    mandateAPI: new MandateAPI(knex),
    accessAPI: new AccessAPI(knex),
  };
  return {
    server: createApolloServer(context, () => dataSources),
    context,
    dataSources,
  };
};
