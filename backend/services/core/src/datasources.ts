import { knex } from 'dsek-shared';

import MemberAPI from './datasources/Member';
import PositionAPI from './datasources/Position';
import CommitteeAPI from './datasources/Committee';
import MandateAPI from './datasources/Mandate';
import AccessAPI from './datasources/Access';
import MailAPI from './datasources/Mail';

export interface DataSources {
  memberAPI: MemberAPI,
  positionAPI: PositionAPI,
  committeeAPI: CommitteeAPI,
  mandateAPI: MandateAPI,
  accessAPI: AccessAPI,
  mailAPI: MailAPI,
}

export default () => ({
  memberAPI: new MemberAPI(knex),
  positionAPI: new PositionAPI(knex),
  committeeAPI: new CommitteeAPI(knex),
  mandateAPI: new MandateAPI(knex),
  accessAPI: new AccessAPI(knex),
  mailAPI: new MailAPI(knex),
});
