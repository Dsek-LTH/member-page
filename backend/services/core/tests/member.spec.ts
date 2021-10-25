import 'mocha';
import mockDb from 'mock-knex';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { UserInputError } from 'apollo-server-errors';

import { context, knex } from 'dsek-shared';
import MemberAPI from '../src/datasources/Member';
import { Member } from '../src/types/database';
import { CreateMember, UpdateMember } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const members: Partial<Member>[] = [
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

const updatedMember: Member = {
  id: 1,
  student_id: 'test',
  first_name: 'Trula',
  nickname: 'Trul',
  last_name: 'Trulsson',
  class_programme: 'C',
  class_year: 2233,
  picture_path: 'static/image.jpeg'
}

const tracker = mockDb.getTracker();
const memberAPI = new MemberAPI(knex);

describe('[MemberAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => {
    tracker.install();
    sandbox.on(memberAPI, 'withAccess', (name, context, fn) => fn());
  })
  afterEach(() => {
    tracker.uninstall();
    sandbox.restore();
  })
  describe('[getMember]', () => {
    it('returns the signed in user', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select')
        query.response([members[1]])
      })
      const res = await memberAPI.getMember({},{student_id: 'asdf-1234-asdf-1234'});
      expect(res).to.deep.equal(members[1])
    })
  })
  describe('[getMembers]', () => {
    const page = 0
    const perPage = 10
    const info = {
      totalPages: 1,
      page: page,
      perPage: perPage,
      hasNextPage: false,
      hasPreviousPage: false,
    }
    it('returns all members', async () => {
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            query.response(members);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: members.length }])
          }
        ][step - 1]()
      });
      const res = await memberAPI.getMembers({}, page, perPage);
      const expected = {
        members: members,
        pageInfo: {
          totalItems: members.length,
          ...info,
        },
      }
      expect(res).to.deep.equal(expected)
    })
    it('returns filtered members', async () => {
      const filter = {id: 1}
      const filtered = [members[0]]
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            expect(query.bindings).to.include(filter.id);
            query.response(filtered);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: filtered.length }])
          }
        ][step - 1]()
      });
      const res = await memberAPI.getMembers({}, page, perPage, filter);
      const expected = {
        members: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        },
      }
      expect(res).to.deep.equal(expected)
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
      const res = await memberAPI.createMember({}, createMember)
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
        await memberAPI.updateMember({}, -1, updateMember)
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
      const res = await memberAPI.updateMember({}, id, updateMember)
      expect(res).to.deep.equal(updatedMember)
    })
  })
  describe('[removeMember]', () => {
    it('throws an error if id is missing', async () => {
      tracker.on('query', query => query.response([]));
      try {
        await memberAPI.removeMember({}, -1);
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
      const res = await memberAPI.removeMember({}, <number> member.id);
      expect(res).to.deep.equal(member);
    })
  })
})