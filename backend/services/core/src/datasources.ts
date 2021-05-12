import { knex } from 'dsek-shared';

import MemberAPI from './datasources/Member';
import PositionAPI from './datasources/Position';
import CommitteeAPI from './datasources/Committee';
import MandateAPI from './datasources/Mandate';

export interface DataSources {
  memberAPI: MemberAPI,
  positionAPI: PositionAPI,
  committeeAPI: CommitteeAPI,
  mandateAPI: MandateAPI,
}

export default () => {
  return {
    memberAPI: new MemberAPI(knex),
    positionAPI: new PositionAPI(knex),
    committeeAPI: new CommitteeAPI(knex),
    mandateAPI: new MandateAPI(knex),
  }
}