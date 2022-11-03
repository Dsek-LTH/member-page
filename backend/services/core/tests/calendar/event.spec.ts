import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { ApolloError, UserInputError } from 'apollo-server';
import { knex } from '~/src/shared';
import EventAPI from '~/src/datasources/Events';
import * as sql from '~/src/types/events';
import * as gql from '~/src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const convertEvent = (
  event: sql.Event,
  numberOfLikes?: number,
  isLikedByMe?: boolean,
): gql.Event => {
  const { author_id: authorId, ...rest } = event;
  const convertedEvent = {
    author: {
      id: authorId,
    },
    ...rest,
    likes: numberOfLikes ?? 0,
    isLikedByMe: isLikedByMe ?? false,
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
      expect(res).to.be('undefined');
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
      expect(res.events).to.deep.equal(events.map((event) => convertEvent(event)));
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
      expect(res).to.deep.equal({
        author: { id: members[0].id },
        id: res?.id,
        likes: 0,
        isLikedByMe: false,
        number_of_updates: 0,
        ...createEvent,
      });
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
        id: res?.id,
        description_en: null,
        short_description_en: null,
        title_en: null,
        number_of_updates: 1,
        likes: 0,
        isLikedByMe: false,
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
      expect(event).to.be('undefined');
    });
  });

  // TODO: Needs actual keycloak id to test
  describe('[likeEvent]', () => {
    it('throws an error if id is missing', async () => {
      await insertEvents();
      try {
        await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('likes and returns updated event', async () => {
      await insertEvents();
      const event = events[0];
      const res = await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, event.id);

      expect(res).to.deep.equal(convertEvent(event, 1, true));
    });

    it('likes mutiple events', async () => {
      await insertEvents();
      const event1 = events[0];
      const event2 = events[1];
      const res1 = await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, event1.id);
      const res2 = await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, event2.id);

      expect(res1).to.deep.equal(convertEvent(event1, 1, true));
      expect(res2).to.deep.equal(convertEvent(event2, 1, true));
    });

    it('throws an error if user already likes event', async () => {
      await insertEvents();
      const event = events[0];
      await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, event.id);
      try {
        await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, event.id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
  });

  describe('[unlikeEvent]', () => {
    it('throws an error if id is missing', async () => {
      await insertEvents();
      try {
        await eventAPI.unlikeEvent({ user: { keycloak_id: '1' } }, 'a30da33d-8b73-4ec7-a425-24885daef1d6');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });

    it('unlikes and returns updated event', async () => {
      await insertEvents();
      const afterLike = await eventAPI.likeEvent({ user: { keycloak_id: '1' } }, events[0].id);
      expect(afterLike?.likes).to.equal(1);
      expect(afterLike?.isLikedByMe).to.equal(true);
      const afterUnlike = await eventAPI.unlikeEvent({ user: { keycloak_id: '1' } }, events[0].id);
      expect(afterUnlike?.likes).to.equal(0);
      expect(afterUnlike?.isLikedByMe).to.equal(false);
    });

    it('throws an error if user doesn\'t like event', async () => {
      await insertEvents();
      try {
        await eventAPI.unlikeEvent({ user: { keycloak_id: '1' } }, events[0].id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
  });
});
