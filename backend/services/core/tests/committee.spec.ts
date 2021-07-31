import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import CommitteeAPI from '../src/datasources/Committee';
import { Committee } from '../src/types/database';
import { ForbiddenError } from 'apollo-server';
import { CommitteeFilter } from '../src/types/graphql';

const committees: Partial<Committee>[] = [
  {id: 1, name: 'test'},
  {id: 2, name: 'test2'},
  {id: 3, name: 'test3'},
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
    const page = 0;
    const perPage = 10;
    const info = {
      totalPages: 1,
      page: page,
      perPage: perPage,
      hasNextPage: false,
      hasPreviousPage: false,
    }
    it('returns all committees on undefined filter', async () => {
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            query.response(committees);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: committees.length }])
          }
        ][step - 1]()
      });
      const res = await committeeAPI.getCommittees(page, perPage);
      const expected = {
        committees: committees,
        pageInfo: {
          totalItems: committees.length,
          ...info,
        },
      }
      expect(res).to.deep.equal(expected)
    })
    it('returns filtered committees', async () => {
      const filter: CommitteeFilter = {id: 2}
      const filtered = [committees[0], committees[1]]
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
      const res = await committeeAPI.getCommittees(page, perPage, filter);
      const expected = {
        committees: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        }
      }
      expect(res).to.deep.equal(expected);
    })
    it('returns no committees', async () => {
      const filter: CommitteeFilter = {id: -1}
      const filtered: Committee[] = [];
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
      const res = await committeeAPI.getCommittees(page, perPage, filter);
      const { totalPages, ...rest } = info;
      const expected = {
        committees: filtered,
        pageInfo: {
          totalItems: filtered.length,
          totalPages: 0,
          ...rest,
        }
      }
      expect(res).to.deep.equal(expected);
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
    it('denies access to signed out users', async () => {
      expect(
        () => committeeAPI.createCommittee(undefined, {name: 'test'})
      ).to.throw(ForbiddenError)
    })
    it('creates committee', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('insert')
        query.response([1])
      })
      await committeeAPI.createCommittee(user, {name: 'test'})
    })
  })
  describe('[updateCommittee]', () => {
    it('denies access to signed out users', async () => {
      expect(
        () => committeeAPI.updateCommittee(undefined, 1, {name: 'test'})
      ).to.throw(ForbiddenError)
    })
    it('updates committee', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('update')
        query.response([1])
      })
      await committeeAPI.updateCommittee(user, 1, {name: 'test'})
    })
  })
  describe('[removeCommittee]', () => {
    it('denies access to signed out users', () => {
      expect(
        () => committeeAPI.removeCommittee(undefined, 1)
      ).to.throw(ForbiddenError)
    })
    it('removes committee', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('del')
        query.response([1])
      })
      await committeeAPI.removeCommittee(user, 1)
    })
  })
})