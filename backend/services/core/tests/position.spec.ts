import 'mocha';
import mockDb from 'mock-knex';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { context, knex } from 'dsek-shared';
import PositionAPI from '../src/datasources/Position';
import { Position } from '../src/types/database';
import { ForbiddenError, UserInputError } from 'apollo-server';
import kcClient from '../src/keycloak';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const positions: Position[] = [
  {id: 'dsek.infu.dwww.medlem', name: 'test', name_en: 'test', committee_id: 1},
  {id: 'dsek.infu.fotograf', name: 'test2', name_en: 'test', committee_id: 3},
  {id: 'dsek.infu.mastare', name: 'test3', name_en: 'test', committee_id: 3},
];

const convertPosition = (position: Partial<Position>) => {
  const { committee_id, name_en, ...rest } = position;
  let p = {};
  if (committee_id) {
    p = {
      committee: { id: committee_id },
      ...p,
    }
  }
  if (name_en) {
    p = {
      nameEn: name_en,
      ...p,
    }
  }
  return {
    ...p,
    ...rest,
  }
}

const tracker = mockDb.getTracker();
const positionAPI = new PositionAPI(knex);

describe('[PositionAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => {
    tracker.install()
    sandbox.on(positionAPI, 'withAccess', (name, context, fn) => fn())
  })
  afterEach(() => {
    tracker.uninstall()
    sandbox.restore()
  })
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
      const res = await positionAPI.getPositions({}, page, perPage);
      const expected = {
        positions: positions.map(convertPosition),
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
      const res = await positionAPI.getPositions({}, page, perPage, filter)
      const expected = {
        positions: filtered.map(convertPosition),
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
      const res = await positionAPI.getPosition({}, {id: 'dsek.infu.dwww.medlem'})
      expect(res).to.deep.equal(convertPosition(positions[0]))
    })
    it('returns no position on multiple matches', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([positions[0], positions[1]])
      })
      const res = await positionAPI.getPosition({}, {committee_id: 3})
      expect(res).to.deep.equal(undefined)
    })
    it('returns no position on no match', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await positionAPI.getPosition({}, {committee_id: 4})
      expect(res).to.deep.equal(undefined)
    })
  })
  describe('[createPosition]', () => {
    const id = 'dsek.infu.dwww.medlem';
    const createPosition = {
      id: id,
      name: "created",
      committee_id: 1,
    }
    const createdPosition = {
      ...createPosition,
    }
    it('creates position if group exists in keycloak', async () => {
      sandbox.on(kcClient, 'createPosition', (id, boardMember) => true)
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createPosition).forEach(v => expect(query.bindings).to.include(v))
          query.response([createPosition]);
        },
      ][step-1]()})

      const res = await positionAPI.createPosition({}, createPosition);
      expect(kcClient.createPosition).to.have.been.called.once.with(id);
      expect(res).to.deep.equal(convertPosition(createdPosition));
    })
    it('creates and removes position if group does not exists in keycloak', async () => {
      sandbox.on(kcClient, 'createPosition', (id, boardMember) => false)
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createPosition).forEach(v => expect(query.bindings).to.include(v))
          query.response([createPosition]);
        },
        () => {
          expect(query.method).to.equal('del');
          expect(query.bindings).to.include(createPosition.id)
          query.response([createPosition]);
        },
      ][step-1]()})

      try {
        await positionAPI.createPosition({}, createPosition);
        expect.fail('should throw Error');
      } catch (e: any) {
        expect(e.message).to.equal('Failed to find group in Keycloak')
      }
      expect(kcClient.createPosition).to.have.been.called.once.with(id);
    })
  })
  describe('[updatePosition]', () => {
    const id = 'dsek.infu.dwww.medlem';
    const updatePosition = {
      name: "updated",
    }
    const updatedPosition = {
      id: id,
      ...updatePosition
    }
    it('throws an error if id is missing', async () => {
      const id = 'dsek.missing';
      tracker.on('query', query => query.response([]));
      try {
        await positionAPI.updatePosition({}, id, updatePosition);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })
    it('updates position', async () => {
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('update');
          expect(query.bindings).to.include(id)
          Object.values(updatePosition).forEach(v => expect(query.bindings).to.include(v))
          query.response([{id, ...updatePosition}]);
        },
      ][step-1]()});
      const res = await positionAPI.updatePosition({}, id, updatePosition);
      expect(res).to.deep.equal(convertPosition(updatedPosition));
    })
  })
  describe('[removePosition]', () => {
    it('throws an error if id is missing', async () => {
      const id = 'dsek.missing';
      tracker.on('query', query => query.response([]));
      try {
        await positionAPI.removePosition({}, id);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })

    it('removes position', async () => {
      const position = positions[0];
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(position.id)
          query.response([position]);
        },
        () => {
          expect(query.method).to.equal('del');
          expect(query.bindings).to.include(position.id)
          query.response(position.id);
        },
      ][step-1]()});

      const res = await positionAPI.removePosition({}, position.id);
      expect(res).to.deep.equal(convertPosition(position));
    })
  })
});
