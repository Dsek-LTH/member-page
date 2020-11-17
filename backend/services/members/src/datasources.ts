import { knex } from 'dsek-shared';

import MemberAPI from './datasources/Member';
import PositionAPI from './datasources/Position';
import CommitteeAPI from './datasources/Committee';

export interface DataSources {
  memberAPI: MemberAPI,
  positionAPI: PositionAPI,
  committeeAPI: CommitteeAPI,
}

export default () => {
  return {
    memberAPI: new MemberAPI(knex),
    positionAPI: new PositionAPI(knex),
    committeeAPI: new CommitteeAPI(knex),
  }
}