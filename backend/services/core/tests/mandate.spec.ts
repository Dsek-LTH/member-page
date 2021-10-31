import 'mocha';
import mockDb from 'mock-knex';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from "dsek-shared";
import * as sql from "../src/types/database";
import MandateAPI from '../src/datasources/Mandate';
import { CreateMandate, Mandate, MandateFilter, UpdateMandate } from '../src/types/graphql';
import { UserInputError } from 'apollo-server';
import kcClient from '../src/keycloak';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const mandates: sql.Mandate[] = [
  {id: 1, start_date: new Date('2021-02-01 10:00:00'), end_date: new Date('2021-02-11 10:00:00'), position_id: 'dsek.infu.dwww.medlem', member_id: 1},
  {id: 2, start_date: new Date('2021-01-01 10:00:00'), end_date: new Date('2021-12-31 10:00:00'), position_id: 'dsek.infu.dwww.medlem', member_id: 2},
  {id: 3, start_date: new Date('2021-03-01 10:00:00'), end_date: new Date('2022-01-01 10:00:00'), position_id: 'dsek.km.mastare', member_id: 2},
];

const createMandate: CreateMandate = {
  position_id: 'dsek.infu.dwww.medlem',
  member_id: 1,
  start_date: new Date('2020-01-01 10:00:00'),
  end_date: new Date('2020-12-31 10:00:00'),
}

const updateMandate: UpdateMandate = {
  position_id: 'dsek.km.mastare',
  member_id: 1,
  start_date: new Date('2020-01-01 10:00:00'),
  end_date: new Date('2020-12-31 10:00:00'),
}

const updatedMandate: sql.Mandate = {
  id: 1,
  position_id: 'dsek.km.mastare',
  member_id: 1,
  start_date: new Date('2020-01-01 10:00:00'),
  end_date: new Date('2020-12-31 10:00:00'),
}

const convertMandate = (mandate:  sql.Mandate):Mandate => {
  const { position_id, member_id, ...rest } = mandate;
  const m: Mandate = {
    position: { id: position_id },
    member: { id: member_id },
    ...rest
  }
  return m;
}

const page = 0;
const perPage = 5;
const yesterday = new Date(new Date().setDate(new Date().getDate()-1));
const tomorrow = new Date(new Date().setDate(new Date().getDate()+1));

const info = {
  totalPages: 1,
  page: page,
  perPage: perPage,
  hasNextPage: false,
  hasPreviousPage: false,
}


const tracker = mockDb.getTracker();
const mandateAPI = new MandateAPI(knex);

describe('[MandateAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => {
    tracker.install()
    sandbox.on(kcClient, 'deleteMandate', (userid, positionid) => {})
    sandbox.on(kcClient, 'createMandate', (userid, positionid) => {})
    sandbox.on(mandateAPI, 'withAccess', (name, context, fn) => fn());
  })
  afterEach(() => {
    tracker.uninstall()
    sandbox.restore()
  })

  describe('[getMandates]', () => {
    it('returns all mandates', async () => {
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            query.response(mandates);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: mandates.length }])
          }
        ][step - 1]()
      });
      const res = await mandateAPI.getMandates({}, page, perPage);
      const expected = {
        mandates: mandates.map(convertMandate),
        pageInfo: {
          totalItems: mandates.length,
          ...info,
        }
      }
      expect(res).to.deep.equal(expected);
    })

    it('returns filtered mandates by position_id', async () => {
      const filter = { position_id: 'dsek.infu.dwww.medlem' };
      const filtered = [mandates[0], mandates[1]]
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            expect(query.bindings).to.include(filter.position_id);
            query.response(filtered);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: filtered.length }])
          }
        ][step - 1]()
      });
      const res = await mandateAPI.getMandates({}, page, perPage, filter);
      const expected = {
        mandates: filtered.map(convertMandate),
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        }
      }
      expect(res).to.deep.equal(expected);
    })

    it('returns filtered mandates by dates', async () => {
      const filter: MandateFilter = { start_date:  new Date('2021-01-15 10:00:00'), end_date:  new Date('2021-02-15 10:00:00')}
      const filtered = [mandates[1]]
      tracker.on('query', (query, step) => {
        [
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('limit');
            expect(query.bindings).to.include(perPage);
            expect(query.bindings).to.include(filter.start_date)
            expect(query.bindings).to.include(filter.end_date)
            query.response(filtered);
          },
          () => {
            expect(query.method).to.equal('select');
            expect(query.sql).to.include('count');
            query.response([{ count: filtered.length }])
          }
        ][step - 1]()
      });
      const res = await mandateAPI.getMandates({}, page, perPage, filter);
      const expected = {
        mandates: filtered.map(convertMandate),
        pageInfo: {
          totalItems: filtered.length,
          ... info
        }
      }
      expect(res).to.deep.equal(expected);
    })
  })

  describe('[createMandate]', () => {
    it('creates a mandate and returns it', async () => {
      const id = 1;
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createMandate).forEach(v => expect(query.bindings).to.include(v))
          query.response([{id, ...createMandate}]);
        },
      ][step-1]()})

      const res = await mandateAPI.createMandate({}, createMandate);
      const expected = {id, ...createMandate}
      expect(res).to.deep.equal(convertMandate(expected));
    })

    it('updates keycloak if mandate is active', async () => {
      const id = 1;
      const createMandate2 = { ...createMandate, start_date: yesterday, end_date: tomorrow }
      tracker.on('query', (query, step) => {[
        () => query.response([{id, ...createMandate2}]),
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
      ][step-1]()})

      await mandateAPI.createMandate({}, createMandate2);
      expect(kcClient.createMandate).to.have.been.called.once.with('dsek.infu.dwww.medlem').and.with('1234-asdf-2134-asdf');
    })

    it('does not update keycloak if mandate is not active', async () => {
      const id = 1;
      tracker.on('query', (query, step) => {[
        () => query.response([{id, ...createMandate}]),
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
      ][step-1]()})

      await mandateAPI.createMandate({}, createMandate);
      expect(kcClient.createMandate).to.not.have.been.called
    })
  })

  describe('[updateMandate]', () => {
    it('throws an error if id is missing', async () => {
      tracker.on('query', (query, step) => {[
        () => query.response([]),
      ][step-1]()});
      const id = -1;
      try {
        await mandateAPI.updateMandate({}, id, updateMandate);
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
          query.response([{id, ...updateMandate}]);
        },
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
      ][step-1]()});
      const res = await mandateAPI.updateMandate({}, id, updateMandate);
      expect(res).to.deep.equal(convertMandate(updatedMandate));
    })

    it('creates in keycloak if mandate is active', async () => {
      const id = updatedMandate.id;
      const updateMandate2 = {...updateMandate, start_date: yesterday, end_date: tomorrow}
      tracker.on('query', (query, step) => {[
        () => query.response([{id, ...updateMandate2}]),
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
      ][step-1]()});
      await mandateAPI.updateMandate({}, id, updateMandate2);
      expect(kcClient.createMandate).to.have.been.called
        .once.with('1234-asdf-2134-asdf')
        .and.with('dsek.km.mastare');
    })

    it('removes from keycloak if mandate is not active', async () => {
      const id = updatedMandate.id;
      tracker.on('query', (query, step) => {[
        () => query.response([{id, ...updateMandate}]),
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
      ][step-1]()});
      await mandateAPI.updateMandate({}, id, updateMandate);
      expect(kcClient.deleteMandate).to.have.been.called
        .once.with('1234-asdf-2134-asdf')
        .and.with('dsek.km.mastare');
    })
  })

  describe('[removeMandate]', () => {
    it('throws an error if id is missing', async () => {
      const id = -1;
      tracker.on('query', query => query.response([]));
      try {
        await mandateAPI.removeMandate({}, id);
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
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
        () => {
          expect(query.method).to.equal('del');
          expect(query.bindings).to.include(mandate.id)
          query.response(mandate.id);
        },
      ][step-1]()});

      const res = await mandateAPI.removeMandate({}, mandate.id);
      expect(res).to.deep.equal(convertMandate(mandate));
    })

    it('removes mandate from keycloak', async () => {
      const mandate = mandates[0];
      tracker.on('query', (query, step) => {[
        () => query.response([mandate]),
        () => query.response([{keycloak_id: '1234-asdf-2134-asdf'}]),
        () => query.response(mandate.id),
      ][step-1]()});

      await mandateAPI.removeMandate({}, mandate.id);
      expect(kcClient.deleteMandate).to.have.been.called.once.with('1234-asdf-2134-asdf').and.with('dsek.infu.dwww.medlem');
    })
  })
});
