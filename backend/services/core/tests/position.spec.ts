import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import PositionAPI from '../src/datasources/Position';
import { Position } from '../src/types/database';
import { ForbiddenError, UserInputError } from 'apollo-server';

const positions: Position[] = [
  {id: 1, name: 'test', name_en: 'test', committee_id: 1},
  {id: 2, name: 'test2', name_en: 'test', committee_id: 3},
  {id: 3, name: 'test3', name_en: 'test', committee_id: 3},
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
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())
  describe('[getPositions]', () => {
    it('returns all positions', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.not.include('where')
        expect(query.method).to.equal('select')
        query.response(positions)
      })
      const res = await positionAPI.getPositions();
      expect(res).to.deep.equal(positions.map(convertPosition));
    })
    it('returns the database response', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([positions[1], positions[2]])
      })
      const res = await positionAPI.getPositions({committee_id: 3})
      const expected = [positions[1], positions[2]]
      expect(res).to.deep.equal(expected.map(convertPosition))
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
    const id = 1;
    const createPosition = {
      name: "created",
      committee_id: 1,
    }
    const createdPosition = {
      id: id,
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
          query.response([id]);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...createPosition}]);
        },
      ][step-1]()})

      const res = await positionAPI.createPosition(user, createPosition);
      const expected = {id, ...createPosition}
      expect(res).to.deep.equal(convertPosition(createdPosition));
    })
  })
  describe('[updatePosition]', () => {
    const id = 1;
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
      const id = -1;
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
          query.response(null);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...updatePosition}]);
        },
      ][step-1]()});
      const res = await positionAPI.updatePosition(user, id, updatePosition);
      expect(res).to.deep.equal(convertPosition(updatedPosition));
    })
  })
  describe('[removePosition]', () => {
    it('denies access to signed out users', async () => {
      const id = 1;
      try {
        await positionAPI.removePosition(undefined, id);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })
    it('throws an error if id is missing', async () => {
      const id = -1;
      tracker.on('query', query => query.response([]));
      try {
        await positionAPI.removePosition(user, id);
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

      const res = await positionAPI.removePosition(user, position.id);
      expect(res).to.deep.equal(convertPosition(position));
    })
  })
});
