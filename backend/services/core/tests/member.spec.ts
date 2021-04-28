import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import MemberAPI from '../src/datasources/Member';
import { DbMember } from '../src/types/mysql';
import { CreateMember, UpdateMember } from '../src/types/graphql';
import { UserInputError } from 'apollo-server-errors';

const members: Partial<DbMember>[] = [
  {id: 1, student_id: 'test'},
  {id: 2, student_id: 'test2'},
  {id: 3, student_id: 'test3'},
]

const createMember: CreateMember = {
  student_id: 'test4',
  first_name: 'Truls',
  nickname: 'Trule',
  last_name: 'Trulsson',
  class_programme: 'D',
  class_year: 2203,
}

const updateMember: UpdateMember = {
  first_name: 'Trula',
  nickname: 'Trul',
  last_name: 'Trulsson',
  class_programme: 'C',
  class_year: 2233,
  picture_path: 'static/image.jpeg'
}

const updatedMember: DbMember = {
  id: 1,
  student_id: 'test',
  first_name: 'Trula',
  nickname: 'Trul',
  last_name: 'Trulsson',
  class_programme: 'C',
  class_year: 2233,
  picture_path: 'static/image.jpeg'
}

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
  describe('[createMember]', () => {
    it('creates committee', async () => {
      const id = 1;
      tracker.on('query', (query) => {
        expect(query.method).to.equal('insert')
        Object.values(createMember).forEach(v => expect(query.bindings).to.include(v))
        query.response([id])
      })
      const res = await memberAPI.createMember(createMember)
      expect(res).to.deep.equal({id, ...createMember})
    })
  })
  describe('[updateMember]', () => {
    it('throws an error if id is missing', async () => {
      tracker.on('query', (query, step) => {
        [
          () => query.response(1),
          () => query.response([])
        ][step - 1]()
      })
      try {
        await memberAPI.updateMember(-1, updateMember)
        expect.fail('Did not throw Error')
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError)
      }
    })
    it('updates member', async () => {
      const id = 1;
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('update')
            Object.values(updateMember).forEach(v => expect(query.bindings).to.include(v))
            query.response(1)
          },
          () => {
            expect(query.method).to.equal('select')
            expect(query.bindings).to.include(id)
            query.response([updatedMember])
          }
        ][step - 1]()
      })
      const res = await memberAPI.updateMember(id, updateMember)
      expect(res).to.deep.equal(updatedMember)
    })
  })
  describe('[removeMember]', () => {
    it('throws an error if id is missing', async () => {
      tracker.on('query', query => query.response([]));
      try {
        await memberAPI.removeMember(-1);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an member', async () => {
      const member = members[0];
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(member.id);
          query.response([member]);
        },
        () => {
          expect(query.method).to.equal('del');
          expect(query.bindings).to.include(member.id);
          query.response(1);
        },
      ][step-1]()})
      const res = await memberAPI.removeMember(<number> member.id);
      expect(res).to.deep.equal(member);
    })
  })
})