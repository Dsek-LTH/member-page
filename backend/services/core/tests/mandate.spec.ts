import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from "dsek-shared";
import { DbMandate } from "../src/types/mysql";
import MandateAPI from '../src/datasources/Mandate';
import { CreateMandate, Mandate, MandateFilter, UpdateMandate } from '../src/types/graphql';
import { ForbiddenError, UserInputError } from 'apollo-server';


const mandates: DbMandate[] = [
  {id: 1, start_date: new Date('2021-02-01 10:00:00'), end_date: new Date('2021-02-11 10:00:00'), position_id: 1, member_id: 1},
  {id: 2, start_date: new Date('2021-01-01 10:00:00'), end_date: new Date('2021-12-31 10:00:00'), position_id: 1, member_id: 2},
  {id: 3, start_date: new Date('2021-03-01 10:00:00'), end_date: new Date('2022-01-01 10:00:00'), position_id: 3, member_id: 2},
];

const createMandate: CreateMandate = {
  position_id: 1,
  member_id: 1,
  start_date: new Date('2021-01-01 10:00:00'),
  end_date: new Date('2021-12-31 10:00:00'),
}

const updateMandate: UpdateMandate = {
  position_id: 2,
  member_id: 1,
  start_date: new Date('2021-01-01 10:00:00'),
  end_date: new Date('2021-12-31 10:00:00'),
}

const updatedMandate: DbMandate = {
  id: 1,
  position_id: 2,
  member_id: 1,
  start_date: new Date('2021-01-01 10:00:00'),
  end_date: new Date('2021-12-31 10:00:00'),
}

const user: context.UserContext = {
  user: {
    keycloak_id: 'kc_id',
    student_id: 's_id',
  },
  roles: ['dsek']
}

const convertMandate = (mandate: DbMandate): Mandate => {
  const { position_id, member_id, ...rest } = mandate;
  const m: Mandate = {
    position: { id: position_id },
    member: { id: member_id },
    ...rest
  }
  return m;
}

const tracker = mockDb.getTracker();
const mandateAPI = new MandateAPI(knex);

describe('[MandateAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())

  describe('[getMandates]', () => {
    it('returns all mandates', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select')
        query.response(mandates)
      })
      const res = await mandateAPI.getMandates();
      expect(res).to.deep.equal(mandates.map(convertMandate));
    })

    it('returns filtered mandates by position_id', async () => {
      const filter = { position_id: 1 };
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select')
        expect(query.bindings).to.include(filter.position_id)
        query.response([mandates[0], mandates[1]])
      })
      const res = await mandateAPI.getMandates(filter);
      const expected = [mandates[0], mandates[1]];
      expect(res).to.deep.equal(expected.map(convertMandate));
    })

    it('returns filtered mandates by dates', async () => {
      const filter: MandateFilter = { start_date:  new Date('2021-01-15 10:00:00'), end_date:  new Date('2021-02-15 10:00:00')}
      tracker.on('query', (query) => {
        expect(query.bindings).to.include(filter.start_date)
        expect(query.bindings).to.include(filter.end_date)
        expect(query.method).to.equal('select')
        query.response([mandates[1]])
      })
      const res = await mandateAPI.getMandates(filter);
      const expected = mandates[1];
      expect(res[0]).to.deep.equal(convertMandate(expected));
    })
  })

  describe('[createMandate]', () => {
    it('creates a mandate throws error when user is not signed in', async () => {
      try {
        await mandateAPI.createMandate(undefined, createMandate);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })

    it('creates a mandate and returns it', async () => {
      const id = 1;
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createMandate).forEach(v => expect(query.bindings).to.include(v))
          query.response([id]);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...createMandate}]);
        },
      ][step-1]()})

      const res = await mandateAPI.createMandate(user, createMandate);
      const expected = {id, ...createMandate}
      expect(res).to.deep.equal(convertMandate(expected));
    })
  })

  describe('[updateMandate]', () => {
    it('updates a mandate throws error when user is not signed in', async () => {
      const id = 1;
      try {
        await mandateAPI.updateMandate(undefined, id, updateMandate);
        expect.fail('Did not throw error');
      } catch (e) {
        expect(e).to.be.instanceOf(ForbiddenError);
      }
    })

    it('throws an error if id is missing', async () => {
      tracker.on('query', (query, step) => {[
        () => query.response(null),
        () => query.response([]),
      ][step-1]()});
      const id = -1;
      try {
        await mandateAPI.updateMandate(user, id, updateMandate);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })

    it('updates and returns a mandate', async () => {
        const id = updatedMandate.id;
        tracker.on('query', (query, step) => {[
          () => {
            expect(query.method).to.equal('update');
            expect(query.bindings).to.include(id)
            Object.values(updateMandate).forEach(v => expect(query.bindings).to.include(v))
            query.response(null);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.bindings).to.include(id)
            query.response([{id, ...updateMandate}]);
          },
        ][step-1]()});
        const res = await mandateAPI.updateMandate(user, id, updateMandate);
        expect(res).to.deep.equal(convertMandate(updatedMandate));
      })
    })

    describe('[removeMandate', () => {
      it('removes a mandate throws error when user is not signed in', async () => {
        const id = 1;
        try {
          await mandateAPI.removeMandate(undefined, id);
          expect.fail('Did not throw error');
        } catch (e) {
          expect(e).to.be.instanceOf(ForbiddenError);
        }
      })

      it('throws an error if id is missing', async () => {
        const id = -1;
          tracker.on('query', query => query.response([]));
          try {
            await mandateAPI.removeMandate(user, id);
            expect.fail('did not throw error');
          } catch(e) {
            expect(e).to.be.instanceof(UserInputError);
          }
      })

      it('removes and returns a mandate', async () => {
        const mandate = mandates[0];
        tracker.on('query', (query, step) => {[
          () => {
            expect(query.method).to.equal('select');
            expect(query.bindings).to.include(mandate.id)
            query.response([mandate]);
          },
          () => {
            expect(query.method).to.equal('del');
            expect(query.bindings).to.include(mandate.id)
            query.response(mandate.id);
          },
        ][step-1]()});

        const res = await mandateAPI.removeMandate(user, mandate.id);
        expect(res).to.deep.equal(convertMandate(mandate));
      })
    })
});
