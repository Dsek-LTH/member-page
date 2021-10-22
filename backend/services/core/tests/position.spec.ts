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
  const { committee_id, ...rest } = position;
  if(committee_id) {
    return {
      committee: {
        id: committee_id,
      },
      ...rest,
    }
  }
  return {
    ...rest,
  }
}

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
  beforeEach(() => {
    tracker.install()
    sandbox.on(kcClient, 'deletePosition', (id) => {})
    sandbox.on(kcClient, 'createPosition', (id, boardMember) => {})
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
      const res = await positionAPI.getPositions(page, perPage);
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
      const res = await positionAPI.getPositions(page, perPage, filter)
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
      const res = await positionAPI.getPosition({id: 'dsek.infu.dwww.medlem'})
      expect(res).to.deep.equal(convertPosition(positions[0]))
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
    const id = 'dsek.infu.dwww.medlem';
    const createPosition = {
      id: id,
      name: "created",
      committee_id: 1,
    }
    const createdPosition = {
      ...createPosition,
    }
    it('denies access to signed out users', async () => {
      try {
        await positionAPI.createPosition(undefined, createPosition);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('creates position', async () => {
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createPosition).forEach(v => expect(query.bindings).to.include(v))
          query.response([createPosition]);
        },
      ][step-1]()})

      const res = await positionAPI.createPosition(user, createPosition);
      expect(kcClient.createPosition).to.have.been.called.once.with(id);
      expect(res).to.deep.equal(convertPosition(createdPosition));
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
    it('denies access to signed out users', async () => {
      try {
        await positionAPI.updatePosition(undefined, id, updatePosition);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('throws an error if id is missing', async () => {
      const id = 'dsek.missing';
      tracker.on('query', query => query.response([]));
      try {
        await positionAPI.updatePosition(user, id, updatePosition);
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
      const res = await positionAPI.updatePosition(user, id, updatePosition);
      expect(res).to.deep.equal(convertPosition(updatedPosition));
    })
  })
  describe('[removePosition]', () => {
    it('denies access to signed out users', async () => {
      const id = 'dsek.infu.dwww.medlem';
      try {
        await positionAPI.removePosition(undefined, id);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('throws an error if id is missing', async () => {
      const id = 'dsek.missing';
      tracker.on('query', query => query.response([]));
      try {
        await positionAPI.removePosition(user, id);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })

    it('removes position and deletes group from keycloak', async () => {
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

      const res = await positionAPI.removePosition(user, position.id);
      expect(kcClient.deletePosition).to.have.been.called.once.with(position.id);
      expect(res).to.deep.equal(convertPosition(position));
    })
  })
});
