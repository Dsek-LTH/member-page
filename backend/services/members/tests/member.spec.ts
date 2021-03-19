import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import MemberAPI from '../src/datasources/Member';
import { DbMember } from '../src/types/mysql';

const members: Partial<DbMember>[] = [
  {id: 1, student_id: 'test'},
  {id: 2, student_id: 'test2'},
  {id: 3, student_id: 'test3'},
]

const user: context.UserContext = {
  user: {
    keycloak_id: 'kc_id',
    student_id: 'test2',
  },
  roles: ['dsek']
}

const tracker = mockDb.getTracker();
const memberAPI = new MemberAPI(knex);

describe('[MemberAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())
  describe('[getMember]', () => {
    it('returns the signed in user', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select')
        query.response([members[1]])
      })
      const res = await memberAPI.getMember({student_id: user.user.student_id});
      expect(res).to.deep.equal(members[1])
    })
    it('returns undefined when signed out', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await memberAPI.getMember({});
      expect(res).to.deep.equal(undefined)
    })
  })
})