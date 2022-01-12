import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import EventAPI, { convertEvent } from '../src/datasources/Events';
import * as sql from '../src/types/database';
import * as gql from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

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
    title_en: 'Programing evening with dsek',
    description: 'Koda koda koda',
    description_en: 'Code code code',
    short_description: 'Koda',
    short_description_en: 'Code',
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
      const res = await eventAPI.getEvent({ language: 'sv' }, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
      expect(res).to.be.undefined;
    });

    it('returns a single event with the specified id', async () => {
      await insertEvents();
      const res = await eventAPI.getEvent({ language: 'sv' }, events[0].id);
      expect(res).to.be.deep.equal(convertEvent(events[0], 'sv'));
    });

    it('returns an event in english', async () => {
      await insertEvents();
      const res = await eventAPI.getEvent({ language: 'en' }, events[2].id);
      expect(res).to.be.deep.equal(convertEvent(events[2], 'en'));
    });

    it('returns an event in swedish if translation is missing', async () => {
      await insertEvents();
      const res = await eventAPI.getEvent({ language: 'en' }, events[0].id);
      expect(res).to.be.deep.equal(convertEvent(events[0], 'sv'));
    });

    it('returns an event in the explicit language', async () => {
      await insertEvents();
      let res = await eventAPI.getEvent({ language: 'en' }, events[2].id, gql.Language.Sv);
      expect(res).to.deep.equal(convertEvent(events[2], 'sv'));

      res = await eventAPI.getEvent({ language: 'sv' }, events[0].id, gql.Language.En);
      expect(res?.title).to.be.undefined;
      expect(res?.description).to.be.undefined;
      expect(res?.short_description).to.be.undefined;
    });
  });

  describe('[getEvents]', () => {
    const page = 0;
    const perPage = 10;

    it('returns all events', async () => {
      await insertEvents();
      const res = await eventAPI.getEvents({ language: 'sv' }, page, perPage, {});
      expect(res.events).to.deep.equal(events.map((e) => convertEvent(e, 'sv')));
    });

    it('returns all events with correct translation', async () => {
      await insertEvents();
      const res = await eventAPI.getEvents({ language: 'en' }, page, perPage, {});
      expect(res.events).to.be.deep.equal([
        convertEvent(events[0], 'sv'),
        convertEvent(events[1], 'sv'),
        convertEvent(events[2], 'en'),
      ]);
    });

    it('returns filtered events', async () => {
      await insertEvents();
      const filter: gql.EventFilter = { start_datetime: '2021-04-01T19:30:00Z' };
      const res = await eventAPI.getEvents({ language: 'sv' }, page, perPage, filter);
      expect(res.events).to.deep.equal([
        convertEvent(events[1], 'sv'),
        convertEvent(events[2], 'sv'),
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
      const res = await eventAPI.createEvent({ user: { keycloak_id: '1' }, language: 'sv' }, createEvent);
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
        await eventAPI.updateEvent({ language: 'sv' }, 'a30da33d-8b73-4ec7-a425-24885daef1d6', updateEvent);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates and returns an event', async () => {
      await insertEvents();
      const res = await eventAPI.updateEvent({ language: 'sv' }, events[0].id, updateEvent);
      const { start_datetime, end_datetime, ...rest } = updateEvent;
      expect(res).to.deep.equal({
        author: { id: members[1].id },
        start_datetime: new Date(start_datetime),
        end_datetime: new Date(end_datetime),
        id: res?.id,
        number_of_updates: 1,
        ...rest,
      });
    });
  });

  describe('[removeEvent]', () => {
    it('throws an error if id is missing', async () => {
      try {
        await eventAPI.removeEvent({ language: 'sv' }, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an event', async () => {
      await insertEvents();
      const res = await eventAPI.removeEvent({ language: 'sv' }, events[0].id);
      const event = await eventAPI.getEvent({ language: 'sv' }, events[0].id);
      expect(res).to.deep.equal(convertEvent(events[0], 'sv'));
      expect(event).to.be.undefined;
    });
  });
});
