import 'mocha';
import mockDb from 'mock-knex';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { context, knex } from 'dsek-shared';
import CommitteeAPI from '../src/datasources/Committee';
import { Committee } from '../src/types/database';
import { ForbiddenError, UserInputError } from 'apollo-server';
import { CommitteeFilter } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const committees: Committee[] = [
  {id: 1, name: 'test', name_en: 'test'},
  {id: 2, name: 'test2', name_en: 'test'},
  {id: 3, name: 'test3', name_en: 'test'},
]

const tracker = mockDb.getTracker();
const committeeAPI = new CommitteeAPI(knex);

describe('[CommitteeAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => {
    tracker.install();
    sandbox.on(committeeAPI, 'withAccess', (name, context, fn) => fn());
  })
  afterEach(() => {
    tracker.uninstall();
    sandbox.restore();
  })
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
      const res = await committeeAPI.getCommittees({}, page, perPage);
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
      const res = await committeeAPI.getCommittees({}, page, perPage, filter);
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
      const res = await committeeAPI.getCommittees({}, page, perPage, filter);
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
      const res = await committeeAPI.getCommittee({}, {id: 1})
      expect(res).to.deep.equal(committees[0])
    })
    it('returns no position on multiple matches', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response(committees)
      })
      const res = await committeeAPI.getCommittee({}, {id: 1})
      expect(res).to.deep.equal(undefined)
    })
    it('returns no position on no match', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where')
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await committeeAPI.getCommittee({}, {id: 4})
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
      const res = await committeeAPI.getCommitteeFromPositionId({}, 1);
      expect(res).to.deep.equal(committees[1])
    })
    it('returns no committee if position doesn\'t have a assigned committee', async () => {
      tracker.on('query', (query) => {
        expect(query.sql.toLowerCase()).to.include('where').and.include('join')
        expect(query.method).to.equal('select')
        query.response([])
      })
      const res = await committeeAPI.getCommitteeFromPositionId({}, 3);
      expect(res).to.deep.equal(undefined)
    })
  })
  describe('[createCommittee]', () => {
    const createCommittee = {
      name: "created",
    }
    const id = 1;
    it('creates committee', async () => {
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createCommittee).forEach(v => expect(query.bindings).to.include(v))
          query.response([{id, ...createCommittee}]);
        },
      ][step-1]()})

      const res = await committeeAPI.createCommittee({}, createCommittee);
      expect(res).to.deep.equal({id, ...createCommittee});
    })
  })
  describe('[updateCommittee]', () => {
    const updateCommittee = {
      name: "updated",
    }
    const id = 1;
    it('throws an error if id is missing', async () => {
      const id = -1;
        tracker.on('query', query => query.response([]));
        try {
          await committeeAPI.updateCommittee({}, id, updateCommittee);
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
          query.response([{id, ...updateCommittee}]);
        },
      ][step-1]()});
      const res = await committeeAPI.updateCommittee({}, id, updateCommittee);
      expect(res).to.deep.equal({id, ...updateCommittee});
    })
  })
  describe('[removeCommittee]', () => {
    it('throws an error if id is missing', async () => {
      const id = -1;
        tracker.on('query', query => query.response([]));
        try {
          await committeeAPI.removeCommittee({}, id);
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

      const res = await committeeAPI.removeCommittee({}, committee.id);
      expect(res).to.deep.equal(committee);
    })
  })
})