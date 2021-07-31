import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import CommitteeAPI from '../src/datasources/Committee';
import { Committee } from '../src/types/database';
import { ForbiddenError, UserInputError } from 'apollo-server';

const committees: Committee[] = [
  {id: 1, name: 'test', name_en: 'test'},
  {id: 2, name: 'test2', name_en: 'test'},
  {id: 3, name: 'test3', name_en: 'test'},
]

const user: context.UserContext = {
  user: {
    keycloak_id: 'kc_id',
    student_id: 'test2',
  },
  roles: ['dsek']
}

const tracker = mockDb.getTracker();
const committeeAPI = new CommitteeAPI(knex);

describe('[CommitteeAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())
  describe('[getCommittees]', () => {
    it('returns all committees on undefined filter', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.not.include('where')
        expect(query.method).to.equal('select')
        query.response(committees)
      })
      const res = await committeeAPI.getCommittees();
      expect(res).to.deep.equal(committees)
    })
    it('returns the database response', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([committees[0], committees[1]])
      })
      const res = await committeeAPI.getCommittees({id: 2});
      expect(res).to.deep.equal([committees[0], committees[1]]);
    })
  })
  describe('[getCommittee]', () => {
    it('returns single committee', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([committees[0]])
      })
      const res = await committeeAPI.getCommittee({id: 1})
      expect(res).to.deep.equal(committees[0])
    })
    it('returns no position on multiple matches', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response(committees)
      })
      const res = await committeeAPI.getCommittee({id: 1})
      expect(res).to.deep.equal(undefined)
    })
    it('returns no position on no match', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await committeeAPI.getCommittee({id: 4})
      expect(res).to.deep.equal(undefined)
    })
  })
  describe('[getCommitteeFromPositionId]', () => {
    it('returns a committee based on position id', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where').and.include('join')
        expect(query.method).to.equal('select')
        query.response([committees[1]])
      })
      const res = await committeeAPI.getCommitteeFromPositionId(1);
      expect(res).to.deep.equal(committees[1])
    })
    it('returns no committee if position doesn\'t have a assigned committee', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where').and.include('join')
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await committeeAPI.getCommitteeFromPositionId(3);
      expect(res).to.deep.equal(undefined)
    })
  })
  describe('[createCommittee]', () => {
    const createCommittee = {
      name: "created",
    }
    const id = 1;
    it('denies access to signed out users', async () => {
      try {
        await committeeAPI.createCommittee(undefined, createCommittee);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('creates committee', async () => {
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createCommittee).forEach(v => expect(query.bindings).to.include(v))
          query.response([id]);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...createCommittee}]);
        },
      ][step-1]()})

      const res = await committeeAPI.createCommittee(user, createCommittee);
      const expected = {id, ...createCommittee}
      expect(res).to.deep.equal({id, ...createCommittee});
    })
  })
  describe('[updateCommittee]', () => {
    const updateCommittee = {
      name: "updated",
    }
    const id = 1;
    it('denies access to signed out users', async () => {
      try {
        await committeeAPI.updateCommittee(undefined, id, updateCommittee);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('throws an error if id is missing', async () => {
      const id = -1;
        tracker.on('query', query => query.response([]));
        try {
          await committeeAPI.updateCommittee(user, id, updateCommittee);
          expect.fail('did not throw error');
        } catch(e) {
          expect(e).to.be.instanceof(UserInputError);
        }
    })
    it('updates committee', async () => {
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('update');
          expect(query.bindings).to.include(id)
          Object.values(updateCommittee).forEach(v => expect(query.bindings).to.include(v))
          query.response(null);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...updateCommittee}]);
        },
      ][step-1]()});
      const res = await committeeAPI.updateCommittee(user, id, updateCommittee);
      expect(res).to.deep.equal({id, ...updateCommittee});
    })
  })
  describe('[removeCommittee]', () => {
    it('denies access to signed out users', async () => {
      const id = 1;
      try {
        await committeeAPI.removeCommittee(undefined, id);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('throws an error if id is missing', async () => {
      const id = -1;
        tracker.on('query', query => query.response([]));
        try {
          await committeeAPI.removeCommittee(user, id);
          expect.fail('did not throw error');
        } catch(e) {
          expect(e).to.be.instanceof(UserInputError);
        }
    })
    it('removes committee', async () => {
      const committee = committees[0];
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(committee.id)
          query.response([committee]);
        },
        () => {
          expect(query.method).to.equal('del');
          expect(query.bindings).to.include(committee.id)
          query.response(committee.id);
        },
      ][step-1]()});

      const res = await committeeAPI.removeCommittee(user, committee.id);
      expect(res).to.deep.equal(committee);
    })
  })
})