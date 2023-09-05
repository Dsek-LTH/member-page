/* eslint-disable @typescript-eslint/naming-convention */
import { UserInputError } from 'apollo-server';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { knex } from '~/src/shared';
import 'mocha';
import { Keycloak } from '~/src/types/database';
import { convertTag } from '~/src/datasources/News';
import NotificationsAPI, { convertToken } from '~/src/datasources/Notifications';
import * as sql from '~/src/types/news';
import createTags from './tags.spec';
import { SQLNotification, Token } from '~/src/types/notifications';
import { NotificationSettingType } from '~/src/shared/notifications';
import insertMembers from '~/seeds/helpers/insertMembers';
import { getFullName } from '~/src/datasources/Member';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createTokens: Partial<Token>[] = [
  {
    expo_token: 'Token1',
  },
  {
    expo_token: 'Token2',
  },
];

let tokens: Token[];
let tags: sql.Tag[];
let members: any[];
let keycloak: any[];

const insertTokens = async () => {
  members = await insertMembers(knex);
  keycloak = await knex<Keycloak>('keycloak').insert(members.map((member, index) => ({
    keycloak_id: `${index}`,
    member_id: member.id,
  }))).returning('*');
  tokens = await knex('expo_tokens').insert(createTokens).returning('*');
};

const insertTags = async () => {
  tags = await knex('tags').insert(createTags).returning('*');
};

const randomDateWithinLastWeek = () => {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  return new Date(weekAgo.getTime() + Math.random() * (now.getTime() - weekAgo.getTime()));
};
const insertNotifications = async () => {
  await knex('notifications').insert([
    ...(members.slice(1).map((member) => ({
      link: '/news/article/testarticle', // not a valid link
      type: NotificationSettingType.LIKE,
      title: 'Testartikel',
      message: `${getFullName(member)} har gillat din nyhet`,
      member_id: members[0].id,
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))),
    ...(members.slice(2).map((member) => ({
      link: '/news/another-article', // not a valid link
      type: NotificationSettingType.LIKE,
      title: 'En annan nyhet',
      message: `${getFullName(member)} har gillat din nyhet`,
      member_id: members[1].id, // another user
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))),
    ...(members.slice(1).map((member) => ({
      link: '/news/test-article', // not a valid link
      type: NotificationSettingType.COMMENT,
      title: `${getFullName(member)} har kommenterat på Testartikel`,
      message: `Detta är min kommentar // Mvh, ${member.first_name} `,
      member_id: members[0].id,
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))),
    ...(members.slice(1).map((member) => ({
      link: '/news/tes-tarticle', // not a valid link
      type: NotificationSettingType.MENTION,
      title: `${getFullName(member)} har kommenterat på Testartikel`,
      message: `Detta är min kommentar // Mvh, ${member.first_name} `,
      member_id: members[0].id,
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))),
    ...(members.slice(1, 4).map((member) => ({
      link: '/news/new-article', // not a valid link
      type: NotificationSettingType.NEW_ARTICLE,
      title: `${getFullName(member)} har nämnt dig i Testartikel`,
      message: `Detta är min kommentar @${member.first_name} ${member.last_name} // Mvh, ${member.first_name} `,
      member_id: members[0].id,
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))),
    ...(members.slice(1).map((member) => ({
      link: '/events/an-event', // not a valid link
      type: NotificationSettingType.EVENT_GOING,
      title: 'An event',
      message: `${getFullName(member)} kommer`,
      member_id: members[0].id,
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))), {
      link: '/', // not a valid link
      type: NotificationSettingType.CREATE_MANDATE,
      title: 'Du har nu posten "Lokalvårdare"',
      message: `${getFullName(members[1])} har gett dig posten "Lokalvårdare"`,
      member_id: members[0].id,
      from_member_id: members[1].id,
      created_at: randomDateWithinLastWeek(),
    }, {
      link: '/booking', // not a valid link
      type: NotificationSettingType.BOOKING_REQUEST,
      title: 'Booking request created',
      message: `${members[2].first_name} ${members[2].last_name} has created a booking request: Jag ska kinga loss`,
      member_id: members[0].id,
      from_member_id: members[2].id,
      created_at: randomDateWithinLastWeek(),
    },
    ...(members.slice(1).map((member) => ({
      link: '/pings', // not a valid link
      type: NotificationSettingType.PING,
      title: 'PING!',
      message: `${getFullName(member)} har pingat dig`,
      member_id: members[0].id,
      from_member_id: member.id,
      created_at: randomDateWithinLastWeek(),
    }))),
  ] as Omit<SQLNotification, 'id' | 'created_at' | 'updated_at'>[]).returning('*');
};

const expectToThrow = async (fn: () => Promise<any>, error: any) => {
  let thrown = true;
  try {
    await fn();
    thrown = false;
  } catch (e) {
    expect(e).to.be.instanceOf(error);
  }
  if (!thrown) expect.fail('Expected to throw');
};

const notificationsAPI = new NotificationsAPI(knex);

describe('[NotificationsAPI]', () => {
  beforeEach(async () => {
    sandbox.on(notificationsAPI, 'withAccess', (name, context, fn) => fn());
    await insertTokens();
    await insertTags();
  });

  afterEach(async () => {
    await knex('keycloak').del();
    await knex('members').del();
    await knex('expo_tokens').del();
    await knex('tags').del();
    await knex('tag_subscriptions').del();
    sandbox.restore();
  });

  describe('[getToken]', () => {
    it('returns token given expo token', async () => {
      const { expo_token } = tokens[0];
      const res = await notificationsAPI.getToken(expo_token);
      expect(res).to.deep.equal(convertToken(tokens[0]));
    });

    it('returns empty subscribed tags', async () => {
      const { keycloak_id } = keycloak[0];
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([]);
    });
  });

  describe('[registerToken]', () => {
    it('registers a new token and returns it', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token100';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
    });

    it('re-registers a token', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token1';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
    });

    it('registers token with new member', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token100';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
      expect(res.memberId).to.equal(members[0].id);
    });

    it('re-registers token with new member', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token1';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
      expect(res.memberId).to.equal(members[0].id);
    });
  });

  describe('[subscribeTags]', () => {
    it('subscribes to a tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([convertTag(tag)]);
    });

    it('subscribes to a tag that is already subscribed to', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([convertTag(tag)]);
    });

    it('fails on subscribtion of non-existing tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tagId = 'nonexistingid';
      expectToThrow(
        () => notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tagId]),
        UserInputError,
      );
    });
  });

  describe('[unsubscribeTags]', () => {
    it('unsubscribes to a tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res1 = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res1).to.deep.equal([convertTag(tag)]);
      await notificationsAPI.unsubscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res2 = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res2).to.deep.equal([]);
    });

    it('unsubscribes to a tag that isn\'t subscribed to', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.unsubscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([]);
    });

    it('does not fail on unsubscribtion of non-existing tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tagId = 'nonexistingtag';
      expectToThrow(
        () => notificationsAPI.unsubscribeTags({ user: { keycloak_id } }, [tagId]),
        UserInputError,
      );
      // await notificationsAPI.unsubscribeTags({user: {keycloak_id: keycloakId}}, [tagId]);
      // const res = await notificationsAPI.getSubscribedTags(token.id);
      // expect(res).to.deep.equal([]);
    });
  });

  describe('[getMyNotifications]', () => {
    beforeEach(async () => {
      await insertNotifications();
    });
    afterEach(async () => {
      await knex('notifications').del();
      sandbox.restore();
    });
    it('returns merged tokens for member', async () => {
      const { keycloak_id } = keycloak[0];
      const res = await notificationsAPI.getMyNotifications({ user: { keycloak_id } });
      // Like+Comment+Mention+New Article*3+Event Going+Create Mandate+Booking Request+Ping
      const amount = 1 + 1 + 1 + 3 + 1 + 1 + 1 + 1;
      expect(res.length).to.equal(amount);
      const likeNotification = res.find(
        (notification) => notification.type === NotificationSettingType.LIKE,
      );
      expect(likeNotification).to.not.be.undefined;
      expect(likeNotification?.members?.length).to.be.equal(members.length - 1);
      const newArticleNotifications = res.filter(
        (notification) => notification.type === NotificationSettingType.NEW_ARTICLE,
      );
      expect(newArticleNotifications.length).to.be.equal(3);
      const bookingRequestNotification = res.find(
        (notification) => notification.type === NotificationSettingType.BOOKING_REQUEST,
      );
      expect(bookingRequestNotification).to.not.be.undefined;
      expect(bookingRequestNotification?.members?.length).to.be.equal(1);
    });
    it('returns nothing if a user has no notifications', async () => {
      const { keycloak_id } = keycloak[3];
      const res = await notificationsAPI.getMyNotifications({ user: { keycloak_id } });
      expect(res).to.deep.equal([]);
    });
    it('only returns the current user\'s notifications', async () => {
      const { keycloak_id } = keycloak[1];
      const res = await notificationsAPI.getMyNotifications({ user: { keycloak_id } });
      expect(res.length).to.equal(1);
      const notification = res[0];
      expect(notification.type).to.equal(NotificationSettingType.LIKE);
      expect(notification.members.length).to.equal(members.length - 2);
      expect(notification.title).to.equal('En annan nyhet');
      const rawNotifications = await knex('notifications').where({ member_id: members[1].id }).orderBy('created_at', 'desc');
      expect(notification.groupedIds).to.deep.equal(rawNotifications.map((n) => n.id));
    });
    it('returns nothing if a user is not logged in', async () => {
      const res = await notificationsAPI.getMyNotifications({});
      expect(res).to.deep.equal([]);
    });
    it('returns notifications in order of newest first', async () => {
      const { keycloak_id } = keycloak[0];
      const res = await notificationsAPI.getMyNotifications({ user: { keycloak_id } });
      res.forEach((notification, index) => {
        if (index !== 0) {
          expect(notification.createdAt).to.be.lessThan(res[index - 1].createdAt);
        }
      });
    });
  });
  describe('[markAsRead]', () => {
    beforeEach(async () => {
      await insertNotifications();
    });
    afterEach(async () => {
      await knex('notifications').del();
      sandbox.restore();
    });
    it('marks a notification as read', async () => {
      const { keycloak_id } = keycloak[1];
      const res = await notificationsAPI.getMyNotifications({ user: { keycloak_id } });
      const notification = res[0];
      const length = notification.groupedIds?.length;
      expect(length).to.equal(members.length - 2);
      expect(notification.readAt).to.be.null;
      const before = new Date();
      await notificationsAPI.markAsRead({ user: { keycloak_id } }, notification.groupedIds ?? []);
      const resAfter = await notificationsAPI.getMyNotifications({ user: { keycloak_id } });
      const updatedNotification = resAfter[0];
      expect(updatedNotification.groupedIds?.length).to.equal(length);
      expect(updatedNotification.readAt).to.not.be.null;
      expect(updatedNotification.readAt).to.be.greaterThan(before);
      const rawNotifications = await knex('notifications').where({ member_id: members[1].id }).orderBy('created_at', 'desc');
      // all read at times should be the same
      const firstReadAt = rawNotifications[0].read_at;
      rawNotifications.forEach((n) => {
        expect(n.read_at).to.deep.equal(firstReadAt);
      });
    });
  });
});
