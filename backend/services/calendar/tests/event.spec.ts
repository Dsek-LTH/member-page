import 'mocha';
import mockDb from 'mock-knex';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import EventAPI from '../src/datasources/Events';
import { CreateEvent, EventFilter } from '../src/types/graphql';
import { UserInputError } from 'apollo-server-errors';
import * as sql from '../src/types/database';
import * as gql from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const convertEvent = (event: sql.Event): gql.Event => {
  const { author_id, ...rest } = event;
  const convertedEvent: gql.Event = {
    author: {
      id: author_id,
    },
    ...rest,
  };
  return convertedEvent;
};

const events: sql.Event[] = [
  {
    id: 1,
    author_id: 1,
    title: "Nytt dsek event",
    description: "Skapat på ett väldigt bra sätt",
    short_description: "Skapat",
    link: "www.dsek.se",
    start_datetime: "2021-03-31 19:30:02",
    end_datetime: "2021-04-01 19:30:02",
    location: "iDét",
    organizer: "DWWW",
  },
  {
    id: 2,
    author_id: 2,
    title: "Dsek lanserar den nya hemsidan",
    description: "Bästa hemsidan",
    short_description: "Bästa",
    link: "www.dsek.se",
    start_datetime: "2021-03-31 19:30:02",
    end_datetime: "2021-12-31 19:30:02",
    location: "Kåraulan",
    organizer: "D-Sektionen",
  },
  {
    id: 3,
    author_id: 3,
    title: "Proggkväll med dsek",
    description: "Koda koda koda",
    short_description: "Koda",
    link: "",
    start_datetime: "2020-01-30 19:30:02",
    end_datetime: "2021-04-01 20:30:02",
    location: "Jupiter",
    organizer: "dsek",
  },
];

const createEvent: CreateEvent = {
  title: "Nytt dsek event",
  description: "Skapat på ett väldigt bra sätt",
  short_description: "Skapat",
  link: "www.dsek.se",
  start_datetime: "2021-03-31 19:30:02",
  end_datetime: "2021-04-01 19:30:02",
  location: "iDét",
  organizer: "DWWW",
};

const updateEvent: sql.Event = {
  id: 1,
  title: "Nytt dsek event",
  author_id: 1,
  description: "Skapat på ett väldigt bra sätt",
  short_description: "Skapat",
  link: "www.dsek.se",
  start_datetime: "2021-03-31 19:30:02",
  end_datetime: "2021-04-01 19:30:02",
  location: "iDét",
  organizer: "DWWW",
};

const tracker = mockDb.getTracker();
const eventAPI = new EventAPI(knex);

describe('[EventAPI]', () => {
  before(() => mockDb.mock(knex))
  after(() => mockDb.unmock(knex))
  beforeEach(() => {
    tracker.install()
    sandbox.on(eventAPI, 'withAccess', (name, context, fn) => fn())
  })
  afterEach(() => {
    tracker.uninstall()
    sandbox.restore()
  })

  describe("[getEvent]", () => {
    it("throws error if id is missing", async () => {
      tracker.on("query", (query) => {
        expect(query.method).to.equal("select");
        query.response([]);
      });
      try {
        const data = await eventAPI.getEvent({}, -1);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });
    it("returns a single event with the specified id", async () => {
      const id = 1;
        tracker.on('query', (query) => {
          expect(query.method).to.equal('select')
          query.response([events[0]])
        })
        const res = await eventAPI.getEvent({}, id);
        expect(res).to.be.deep.equal(convertEvent(events[0]));
      })
  })

  describe('[getEvents]', () => {
    it('returns all events', async () => {
        tracker.on('query', (query) => {
          expect(query.method).to.equal('select')
          query.response(events)
        })
        const res = await eventAPI.getEvents({}, {});
        expect(res).to.deep.equal(events.map(convertEvent));
    })
    it('returns filtered events', async () => {
        const filter: EventFilter = { start_datetime: "2021-03-31 19:30:02" }
        tracker.on('query', (query) => {
            expect(query.bindings).to.include(filter.start_datetime)
            expect(query.method).to.equal('select')
            query.response([events[0], events[1]])
        })
        const res = await eventAPI.getEvents({}, filter);
        expect(res).to.deep.equal([
          convertEvent(events[0]),
          convertEvent(events[1]),
        ]);
    })
  })

  describe("[createEvent]", () => {
    it("creates an event and returns it", async () => {
      const id = 1;
      const keycloakId = "1234-asdf-1234-asdf";
      const userId = 10;
      tracker.on("query", (query, step) => {
        [
          () => {
            expect(query.method).to.equal("select");
            expect(query.bindings).to.include(keycloakId);
            query.response([{ member_id: userId }]);
          },
          () => {
            expect(query.method).to.equal("insert");
            Object.values(createEvent).forEach((v) =>
              expect(query.bindings).to.include(v)
            );
            query.response([id]);
          },
        ][step - 1]();
      });

      const res = await eventAPI.createEvent({user: {keycloak_id: keycloakId}}, createEvent);
      expect(res).to.deep.equal({author: { id: userId }, id, ...createEvent});
    })
  })

  describe("[updateEvent]", () => {
    it("throws an error if id is missing", async () => {
      tracker.on("query", (query, step) => {
        [() => query.response(null), () => query.response([])][step - 1]();
      });
      const id = -1;
      try {
        await eventAPI.updateEvent({}, id, updateEvent);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });
    it("updates and returns an event", async () => {
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
          query.response([{...updateEvent}]);
        },
      ][step-1]()});
      const res = await eventAPI.updateEvent({}, id, updateEvent);
      expect(res).to.deep.equal({ ...convertEvent(updateEvent), id });
    })
  })

  describe("[removeEvent]", () => {
    it("throws an error if id is missing", async () => {
      tracker.on("query", (query) => query.response([]));
      try {
        await eventAPI.removeEvent({}, -1);
        expect.fail('did not throw error');
      } catch(e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });
    it("removes and returns an event", async () => {
      const event = events[0];
      tracker.on("query", (query, step) => {
        [
          () => {
            expect(query.method).to.equal("select");
            expect(query.bindings).to.include(event.id);
            query.response([event]);
          },
          () => {
            expect(query.method).to.equal("del");
            expect(query.bindings).to.include(event.id);
            query.response(event.id);
          },
        ][step - 1]();
      });

      const res = await eventAPI.removeEvent({}, event.id);
      expect(res).to.deep.equal(convertEvent(events[0]));
    })
  })
})
