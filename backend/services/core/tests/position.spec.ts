import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import PositionAPI from '../src/datasources/Position';
import { DbPosition } from '../src/types/mysql';
import { ForbiddenError } from 'apollo-server';

const positions: Partial<DbPosition>[] = [
  {id: 1, name: 'test'},
  {id: 2, name: 'test2', committee_id: 3},
  {id: 3, name: 'test3', committee_id: 3},
];
const user: context.UserContext = {
  user: {
    keycloak_id: 'kc_id',
    student_id: 's_id',
  },
  roles: ['dsek']
}

const tracker = mockDb.getTracker();
const positionAPI = new PositionAPI(knex);

describe('[PositionAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())
  describe('[getPositions]', () => {
    const page = 0
    const perPage = 20
    const info = {
      totalPages: 1,
      page: page,
      perPage: perPage,
      hasNextPage: false,
      hasPreviousPage: false,
    }
    it('returns all positions', async () => {
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.sql).to.not.include('where');
            expect(query.bindings).to.include(perPage);
            query.response(positions);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: positions.length }])
          }
        ][step - 1]()
      });
      const res = await positionAPI.getPositions(page, perPage);
      const expected = {
        positions: positions,
        pageInfo: {
          totalItems: positions.length,
          ...info,
        }
      }
      expect(res).to.deep.equal(expected);
    })
    it('returns filtered positions', async () => {
      const filter = {committee_id: 3}
      const filtered = [positions[1], positions[2]]
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            expect(query.bindings).to.include(filter.committee_id);
            query.response(filtered);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: filtered.length }])
          }
        ][step - 1]()
      });
      const res = await positionAPI.getPositions(page, perPage, filter)
      const expected = {
        positions: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        }
      }
      expect(res).to.deep.equal(expected)
    })
  })
  describe('[getPosition]', () => {
    it('returns single position', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([positions[0]])
      })
      const res = await positionAPI.getPosition({id: 1})
      expect(res).to.deep.equal(positions[0])
    })
    it('returns no position on multiple matches', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([positions[0], positions[1]])
      })
      const res = await positionAPI.getPosition({committee_id: 3})
      expect(res).to.deep.equal(undefined)
    })
    it('returns no position on no match', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await positionAPI.getPosition({committee_id: 4})
      expect(res).to.deep.equal(undefined)
    })
  })
  describe('[createPosition]', () => {
    it('denies access to signed out users', async () => {
      expect(
        () => positionAPI.createPosition(undefined, {name: 'test'})
      ).to.throw(ForbiddenError)
    })
    it('creates position', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('insert')
        query.response([1])
      })
      await positionAPI.createPosition(user, {name: 'test'})
    })
  })
  describe('[updatePosition]', () => {
    it('denies access to signed out users', async () => {
      expect(
        () => positionAPI.updatePosition(undefined, 1, {name: 'test'})
      ).to.throw()
    })
    it('updates position', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('update')
        query.response([1])
      })
      await positionAPI.updatePosition(user, 1, {name: 'test'})
    })
  })
  describe('[removePosition]', () => {
    it('denies access to signed out users', () => {
      expect(
        () => positionAPI.removePosition(undefined, 1)
      ).to.throw(ForbiddenError)
    })
    it('removes position', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('del')
        query.response([1])
      })
      await positionAPI.removePosition(user, 1)
    })
  })
});
