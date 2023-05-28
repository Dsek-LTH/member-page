import { Knex } from 'knex';
import { DEFAULT_SUBSCRIPTION_SETTINGS } from '../../src/shared/notifications';
import { SQLNotification, SubscriptionSetting } from '../../src/types/notifications';

export async function insertSubscriptionSettings(knex: Knex, memberIds: string[]) {
  await knex<SubscriptionSetting>('subscription_settings').insert(
    memberIds.flatMap((memberId) => (
      DEFAULT_SUBSCRIPTION_SETTINGS.map((setting) => ({
        ...setting,
        member_id: memberId,
      })))),
  );
}

export async function insertNotifications(knex: Knex, memberIds: string[]) {
  await knex<SQLNotification>('notifications').insert(memberIds.flatMap((memberId, index) => [{
    link: '/news/article/testarticle',
    type: 'LIKE',
    title: 'Du har fått en ny gillning',
    message: 'Alfons Åberg har gillat din nyhet "Testartikel"',
    member_id: memberId,
    from_member_id: memberIds[(index + 1) % memberIds.length],
  }, {
    link: '/news/article/testarticle',
    type: 'LIKE',
    title: 'Du har fått en ny gillning',
    message: 'Karlsson von Taket har gillat din nyhet "Testartikel"',
    member_id: memberId,
    from_member_id: memberIds[(index + 2) % memberIds.length],
  }, {
    link: '/news/article/testarticle',
    type: 'LIKE',
    title: 'Du har fått en ny gillning',
    message: 'Findus Pettson har gillat din nyhet "Testartikel"',
    member_id: memberId,
    from_member_id: memberIds[(index + 3) % memberIds.length],
  }, {
    link: '/news/article/testarticle',
    type: 'COMMENT',
    title: 'Du har fått en ny kommentar',
    message: 'Mumin Trollet har kommenterat på din nyhet "Testartikel"',
    member_id: memberId,
    from_member_id: memberIds[(index + 4) % memberIds.length],
  }, {
    link: '/news/article/testarticle',
    type: 'COMMENT',
    title: 'Du har fått en ny kommentar',
    message: 'Tumme Lisa har kommenterat på din nyhet "Testartikel"',
    member_id: memberId,
    from_member_id: memberIds[(index + 5) % memberIds.length],
  }]));
}
