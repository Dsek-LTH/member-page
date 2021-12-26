import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import { UserInputError } from 'apollo-server-errors';
import EventAPI from '../src/datasources/Events';
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

const createEvents: sql.CreateEvent[] = [
  {
    author_id: '11e9081c-c68d-4bea-8090-7a812d1dcfda',
    title: 'Nytt dsek event',
    description: 'Skapat på ett väldigt bra sätt',
    short_description: 'Skapat',
    link: 'www.dsek.se',
    start_datetime: '2021-03-31T19:30:00Z',
    end_datetime: '2021-03-31T22:30:00Z',
    location: 'iDét',
    organizer: 'DWWW',
  },
  {
    author_id: '11e9081c-c68d-4bea-8090-7a812d1dcfda',
    title: 'Dsek lanserar den nya hemsidan',
    description: 'Bästa hemsidan',
    short_description: 'Bästa',
    link: 'www.dsek.se',
    start_datetime: '2021-04-05T17:00:00Z',
    end_datetime: '2021-04-05T19:30:00Z',
    location: 'Kåraulan',
    organizer: 'D-sektionen',
  },
  {
    author_id: '11e9081c-c68d-4bea-8090-7a812d1dcfda',
    title: 'Proggkväll med dsek',
    description: 'Koda koda koda',
    short_description: 'Koda',
    link: '',
    start_datetime: '2021-05-30T19:30:00Z',
    end_datetime: '2021-06-01T20:30:00Z',
    location: 'Jupiter',
    organizer: 'D-sektionen',
  },
];

let events: sql.Event[];
let members: any[];

const insertEvents = async () => {
  members = await knex('members').insert([{ student_id: 'ab1234cd-s' }, { student_id: 'dat12abc' }]).returning('*');
  await knex('keycloak').insert([{ keycloak_id: '1', member_id: members[0].id }, { keycloak_id: '2', member_id: members[1].id }]).returning('*');
  events = await knex('events').insert(createEvents.map((e, i) => ({ ...e, author_id: (i) ? members[0].id : members[1].id }))).returning('*');
};

const eventAPI = new EventAPI(knex);

describe('[EventAPI]', () => {
  beforeEach(() => {
    sandbox.on(eventAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('events').del();
    await knex('keycloak').del();
    await knex('members').del();
    sandbox.restore();
  });

  describe('[getEvent]', () => {
    it('returns undefined on missing id', async () => {
      await insertEvents();
      const res = await eventAPI.getEvent({}, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
      expect(res).to.be.undefined;
    });

    it('returns a single event with the specified id', async () => {
      await insertEvents();
      const res = await eventAPI.getEvent({}, events[0].id);
      expect(res).to.be.deep.equal(convertEvent(events[0]));
    });
  });

  describe('[getEvents]', () => {
    const page = 0;
    const perPage = 10;

    it('returns all events', async () => {
      await insertEvents();
      const res = await eventAPI.getEvents({}, page, perPage, {});
      expect(res.events).to.deep.equal(events.map(convertEvent));
    });

    it('returns filtered events', async () => {
      await insertEvents();
      const filter: gql.EventFilter = { start_datetime: '2021-04-01T19:30:00Z' };
      const res = await eventAPI.getEvents({}, page, perPage, filter);
      expect(res.events).to.deep.equal([
        convertEvent(events[1]),
        convertEvent(events[2]),
      ]);
    });
  });

  describe('[createEvent]', () => {
    const createEvent: gql.CreateEvent = {
      title: 'Nytt dsek event',
      description: 'Skapat på ett väldigt bra sätt',
      short_description: 'Skapat',
      link: 'www.dsek.se',
      start_datetime: '2021-03-31T19:30:00Z',
      end_datetime: '2021-04-01T19:30:00Z',
      location: 'iDét',
      organizer: 'DWWW',
    };

    it('creates an event and returns it', async () => {
      await insertEvents();
      const res = await eventAPI.createEvent({ user: { keycloak_id: '1' } }, createEvent);
      expect(res).to.deep.equal({ author: { id: members[0].id }, id: res?.id, ...createEvent });
    });
  });

  describe('[updateEvent]', () => {
    const updateEvent: gql.UpdateEvent = {
      title: 'Nytt dsek event',
      description: 'Skapat på ett väldigt bra sätt',
      short_description: 'Skapat',
      link: 'www.dsek.se',
      start_datetime: '2021-03-31T19:30:00Z',
      end_datetime: '2021-04-01T19:30:00Z',
      location: 'iDét',
      organizer: 'DWWW',
    };

    it('throws an error if id is missing', async () => {
      try {
        await eventAPI.updateEvent({}, 'a30da33d-8b73-4ec7-a425-24885daef1d6', updateEvent);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates and returns an event', async () => {
      await insertEvents();
      const res = await eventAPI.updateEvent({}, events[0].id, updateEvent);
      const { start_datetime, end_datetime, ...rest } = updateEvent;
      expect(res).to.deep.equal({
        author: { id: members[1].id },
        start_datetime: new Date(start_datetime),
        end_datetime: new Date(end_datetime),
        id: res?.id,
        description_en: null,
        short_description_en: null,
        title_en: null,
        ...rest,
      });
    });
  });

  describe('[removeEvent]', () => {
    it('throws an error if id is missing', async () => {
      try {
        await eventAPI.removeEvent({}, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an event', async () => {
      await insertEvents();
      const res = await eventAPI.removeEvent({}, events[0].id);
      const event = await eventAPI.getEvent({}, events[0].id);
      expect(res).to.deep.equal(convertEvent(events[0]));
      expect(event).to.be.undefined;
    });
  });
});
