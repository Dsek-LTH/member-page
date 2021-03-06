import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import EventAPI from '../src/datasources/Events';
import { DbEvent } from '../src/types/mysql';
import { CreateEvent, EventFilter, UpdateEvent } from '../src/types/graphql';
import { UserInputError } from 'apollo-server-errors';


const events: DbEvent[] = [
  {id: 1, title: "Nytt dsek event", description: "Skapat", link: "www.dsek.se", start_datetime: "2021-03-31 19:30:02", end_datetime: "2021-04-01 19:30:02"},
  {id: 2, title: "Dsek lanserar den nya hemsidan", description: "Bästa hemsidan", link: "www.dsek.se", start_datetime: "2021-03-31 19:30:02", end_datetime: "2021-12-31 19:30:02"},
  {id: 3, title: "Proggkväll med dsek", description: "Koda koda koda", link: "", start_datetime: "2020-01-30 19:30:02", end_datetime: "2021-04-01 20:30:02"},
]

const createEvent: CreateEvent = {
  title: "Nytt dsek event",
  description: "Skapat",
  link: "www.dsek.se",
  start_datetime: "2021-03-31 19:30:02",
  end_datetime: "2021-04-01 19:30:02"
}

const updateEvent: UpdateEvent = {
  title: "Nytt dsek event",
  description: "Uppdaterat",
  link: "www.dsek.se",
  start_datetime: "2021-03-31 19:30:02",
  end_datetime: "2021-04-01 19:30:02"
}

const tracker = mockDb.getTracker();
const eventAPI = new EventAPI(knex);

describe('[EventAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => tracker.install())
  afterEach(() => tracker.uninstall())

  describe('[getEvent]', () => {
    it('throws error if id is missing', async () => {
      tracker.on('query', (query) => {
        expect(query.method).to.equal('select')
        query.response([])
      })
      try {
        const data = await eventAPI.getEvent(-1);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })
    it('returns a single event with the specified id', async () => {
      const id = 1;
        tracker.on('query', (query) => {
          expect(query.method).to.equal('select')
          query.response([events[0]])
        })
        const res = await eventAPI.getEvent(id);
        expect(res).to.be.deep.equal(events[0]);
      })
  })

  describe('[getEvents]', () => {
    it('returns all events', async () => {
        tracker.on('query', (query) => {
          expect(query.method).to.equal('select')
          query.response(events)
        })
        const res = await eventAPI.getEvents({});
        expect(res).to.deep.equal(events);
    })
    it('returns filtered events', async () => {
        const filter: EventFilter = { start_datetime: "2021-03-31 19:30:02" }
        tracker.on('query', (query) => {
            expect(query.bindings).to.include(filter.start_datetime)
            expect(query.method).to.equal('select')
            query.response([events[0], events[1]])
        })
        const res = await eventAPI.getEvents(filter);
        expect(res).to.deep.equal([events[0], events[1]]);
    })
  })

  describe('[createEvent]', () => {
    it('creates an event and returns it', async () => {
      const id = 1;
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('insert');
          Object.values(createEvent).forEach(v => expect(query.bindings).to.include(v))
          query.response([id]);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...createEvent}]);
        },
      ][step-1]()})

      const res = await eventAPI.createEvent(createEvent);
      expect(res).to.deep.equal({id, ...createEvent});
    })
  })

  describe('[updateEvent]', () => {
    it('throws an error if id is missing', async () => {
      tracker.on('query', (query, step) => {[
        () => query.response(null),
        () => query.response([]),
      ][step-1]()});
      const id = -1;
      try {
        await eventAPI.updateEvent(id, updateEvent);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })
    it('updates and returns an event', async () => {
      const id = 1;
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('update');
          expect(query.bindings).to.include(id)
          Object.values(updateEvent).forEach(v => expect(query.bindings).to.include(v))
          query.response(null);
        },
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(id)
          query.response([{id, ...updateEvent}]);
        },
      ][step-1]()});
      const res = await eventAPI.updateEvent(id, updateEvent);
      expect(res).to.deep.equal({id, ...updateEvent});
    })
  })

  describe('[removeEvent]', () => {
    it('throws an error if id is missing', async () => {
      tracker.on('query', query => query.response([]));
      try {
        await eventAPI.removeEvent(-1);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    })
    it('removes and returns an event', async () => {
      const event = events[0];
      tracker.on('query', (query, step) => {[
        () => {
          expect(query.method).to.equal('select');
          expect(query.bindings).to.include(event.id)
          query.response([event]);
        },
        () => {
          expect(query.method).to.equal('del');
          expect(query.bindings).to.include(event.id)
          query.response(event.id);
        },
      ][step-1]()});

      const res = await eventAPI.removeEvent(event.id);
      expect(res).to.deep.equal(events[0]);
    })
  })
})