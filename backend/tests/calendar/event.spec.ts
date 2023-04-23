import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { ApolloError, UserInputError } from 'apollo-server';
import { knex } from '~/src/shared';
import EventAPI from '~/src/datasources/Events';
import * as sql from '~/src/types/events';
import * as gql from '~/src/types/graphql';
import { slugify } from '~/src/shared/utils';
import { convertEvent } from '~/src/shared/converters';

chai.use(spies);
const sandbox = chai.spy.sandbox();

function addDays(date: Date, days: number) {
  date.setDate(date.getDate() + days);
  return date;
}

const createEvents: sql.CreateEvent[] = [
  {
    author_id: '11e9081c-c68d-4bea-8090-7a812d1dcfda',
    title: 'Nytt dsek event',
    description: 'Skapat på ett väldigt bra sätt',
    short_description: 'Skapat',
    link: 'www.dsek.se',
    start_datetime: '2020-01-01T19:30:00Z',
    end_datetime: '2021-03-31T22:30:00Z',
    location: 'iDét',
    organizer: 'DWWW',
    alarm_active: false,
  },
  {
    author_id: '11e9081c-c68d-4bea-8090-7a812d1dcfda',
    title: 'Dsek lanserar den nya hemsidan',
    description: 'Bästa hemsidan',
    short_description: 'Bästa',
    link: 'www.dsek.se',
    start_datetime: '2021-01-01T17:00:00Z',
    end_datetime: '2021-04-05T19:30:00Z',
    location: 'Kåraulan',
    organizer: 'D-sektionen',
    alarm_active: false,
  },
  {
    author_id: '11e9081c-c68d-4bea-8090-7a812d1dcfda',
    title: 'Proggkväll med dsek',
    description: 'Koda koda koda',
    short_description: 'Koda',
    link: '',
    start_datetime: '2022-05-30T19:30:00Z',
    end_datetime: '2022-06-01T20:30:00Z',
    location: 'Jupiter',
    organizer: 'D-sektionen',
    alarm_active: false,
  },
];

let events: sql.Event[];
let members: any[];

const insertMembers = async () => {
  members = await knex('members').insert([{ student_id: 'ab1234cd-s' }, { student_id: 'dat12abc' }]).returning('*');
  await knex('keycloak').insert([{ keycloak_id: '1', member_id: members[0].id }, { keycloak_id: '2', member_id: members[1].id }]).returning('*');
};

const insertEvents = async () => {
  await insertMembers();
  events = await knex('events').insert(createEvents.map((e, i) => ({ ...e, slug: `${slugify(e.title)}-1`, author_id: (i) ? members[0].id : members[1].id }))).returning('*');
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
      expect(res).to.be.deep.equal(convertEvent({ event: events[0] }));
    });
  });

  describe('[getEvents]', () => {
    const page = 0;
    const perPage = 10;

    it('returns all events', async () => {
      await insertEvents();
      const res = await eventAPI.getEvents({}, page, perPage, {});
      expect(res.events).to.deep.equal(events.map((event) => convertEvent({ event })).sort((a, b) =>
        new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()));
    });

    it('returns filtered events', async () => {
      await insertEvents();
      const filter: gql.EventFilter = { start_datetime: '2021-04-01T19:30:00Z' };
      const res = await eventAPI.getEvents({}, page, perPage, filter);
      expect(res.events).to.deep.equal([
        convertEvent({ event: events[2] }),
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
      alarm_active: true,
    };

    it('creates an event and returns it', async () => {
      await insertMembers();
      const res = await eventAPI.createEvent({ user: { keycloak_id: '1' } }, createEvent);
      expect(res).to.deep.equal({
        author: { id: members[0].id },
        id: res?.id,
        slug: `${slugify(res?.title!)}-1`,
        peopleGoing: [],
        peopleInterested: [],
        iAmGoing: false,
        iAmInterested: false,
        number_of_updates: 0,
        comments: [],
        alarm_active: true,
        ...createEvent,
      });
    });
  });

  describe('[testLarm]', () => {
    const createEvent: gql.CreateEvent = {
      title: 'Larmat event',
      description: 'Skapat för ett larm',
      short_description: 'Skapat',
      link: 'www.dsek.se',
      start_datetime: new Date(),
      end_datetime: addDays(new Date(), 1),
      location: 'iDét',
      organizer: 'DWWW',
      alarm_active: true,
    };
    it('creates an ongoing event with larm', async () => {
      await insertMembers();
      await eventAPI.createEvent({ user: { keycloak_id: '1' } }, createEvent);
      const alarmActive = await eventAPI.alarmShouldBeActive();
      expect(alarmActive).to.be.true;
    });
    it('creates an non-ongoing event with larm', async () => {
      await insertMembers();
      await eventAPI.createEvent({ user: { keycloak_id: '1' } }, { ...createEvent, start_datetime: '2022-01-01', end_datetime: '2022-01-02' });
      const alarmActive = await eventAPI.alarmShouldBeActive();
      expect(alarmActive).to.be.false;
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
      const { start_datetime: startDate, end_datetime: endDate, ...rest } = updateEvent;
      expect(res).to.deep.equal({
        author: { id: members[1].id },
        start_datetime: new Date(startDate),
        end_datetime: new Date(endDate),
        slug: `${slugify(res?.title!)}-1`,
        id: res?.id,
        description_en: null,
        short_description_en: null,
        title_en: null,
        removed_at: null,
        number_of_updates: 1,
        peopleGoing: [],
        peopleInterested: [],
        iAmGoing: false,
        iAmInterested: false,
        comments: [],
        alarm_active: false,
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
      expect(res).to.deep.equal(convertEvent({ event: events[0] }));
      expect(event).to.be.undefined;
    });
  });

  // TODO: Needs actual keycloak id to test
  describe('[setGoingToEvent]', () => {
    it('throws an error if id is missing', async () => {
      await insertEvents();
      try {
        await eventAPI.setGoing({ user: { keycloak_id: '1' } }, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('sets going to and returns updated event', async () => {
      await insertEvents();
      const event = events[0];
      const res = await eventAPI.setGoing({ user: { keycloak_id: '1' } }, event.id);
      expect(res).to.deep.equal(convertEvent({ event, peopleGoing: [members[0]], iAmGoing: true }));
    });

    it('sets going to mutiple events', async () => {
      await insertEvents();
      const event1 = events[0];
      const event2 = events[1];
      const res1 = await eventAPI.setGoing({ user: { keycloak_id: '1' } }, event1.id);
      const res2 = await eventAPI.setGoing({ user: { keycloak_id: '1' } }, event2.id);

      expect(res1).to.deep.equal(convertEvent({
        event: event1,
        peopleGoing: [members[0]],
        iAmGoing: true,
      }));
      expect(res2).to.deep.equal(convertEvent({
        event: event2,
        peopleGoing: [members[0]],
        iAmGoing: true,
      }));
    });

    it('throws an error if user is already going to event', async () => {
      await insertEvents();
      const event = events[0];
      await eventAPI.setGoing({ user: { keycloak_id: '1' } }, event.id);
      try {
        await eventAPI.setGoing({ user: { keycloak_id: '1' } }, event.id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
  });

  describe('[unsetGoingToEvent]', () => {
    it('throws an error if id is missing', async () => {
      await insertEvents();
      try {
        await eventAPI.unsetGoing({ user: { keycloak_id: '1' } }, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });

    it('set going, unsets going and returns updated event', async () => {
      await insertEvents();
      const afterLike = await eventAPI.setGoing({ user: { keycloak_id: '1' } }, events[0].id);
      expect(afterLike?.peopleGoing.length).to.equal(1);
      expect(afterLike?.iAmGoing).to.equal(true);
      const afterUnlike = await eventAPI.unsetGoing({ user: { keycloak_id: '1' } }, events[0].id);
      expect(afterUnlike?.peopleGoing.length).to.equal(0);
      expect(afterUnlike?.iAmGoing).to.equal(false);
    });

    it('throws an error if user is not going to event in the first place', async () => {
      await insertEvents();
      try {
        await eventAPI.unsetGoing({ user: { keycloak_id: '1' } }, events[0].id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
  });
});
