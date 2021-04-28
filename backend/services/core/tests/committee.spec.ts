import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import CommitteeAPI from '../src/datasources/Committee';
import { DbCommittee } from '../src/types/mysql';
import { ForbiddenError } from 'apollo-server';

const committees: Partial<DbCommittee>[] = [
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