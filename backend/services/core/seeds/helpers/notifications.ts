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
    link: '/news/article/testarticle', // not a valid link
    type: 'LIKE',
    title: 'Testartikel',
    message: 'Alfons Åberg har gillat din nyhet',
    member_id: memberId,
    from_member_id: memberIds[(index + 1) % memberIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'LIKE',
    title: 'Testartikel',
    message: 'Karlsson von Taket har gillat din nyhet',
    member_id: memberId,
    from_member_id: memberIds[(index + 2) % memberIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'LIKE',
    title: 'Testartikel',
    message: 'Findus Pettson har gillat din nyhet',
    member_id: memberId,
    from_member_id: memberIds[(index + 3) % memberIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'COMMENT',
    title: 'Mumin Trollet har kommenterat på Testartikel',
    message: 'Vilken spännande nyhet',
    member_id: memberId,
    from_member_id: memberIds[(index + 4) % memberIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'COMMENT',
    title: 'Tumme Lisa har kommenterat på Testartikel',
    message: 'Som jag väntat på när denna nyheten skulle komma, vad tycker du @Tumme Lisa?',
    member_id: memberId,
    from_member_id: memberIds[(index + 5) % memberIds.length],
  }]));
}
