import { Knex } from 'knex';
import { DEFAULT_SUBSCRIPTION_SETTINGS } from '../../src/shared/notifications';
import { SQLNotification, SubscriptionSetting } from '../../src/types/notifications';
import { Author } from '../../src/types/author';

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
  const authorIds = (await knex<Author>('authors').select('id').whereIn('member_id', memberIds)).map((a) => a.id);
  await knex<SQLNotification>('notifications').insert(memberIds.flatMap((memberId, index) => [{
    link: '/news/article/testarticle', // not a valid link
    type: 'LIKE',
    title: 'Testartikel',
    message: 'Alfons Åberg har gillat din nyhet',
    member_id: memberId,
    from_author_id: authorIds[(index + 1) % authorIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'LIKE',
    title: 'Testartikel',
    message: 'Karlsson von Taket har gillat din nyhet',
    member_id: memberId,
    from_author_id: authorIds[(index + 2) % authorIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'LIKE',
    title: 'Testartikel',
    message: 'Findus Pettson har gillat din nyhet',
    member_id: memberId,
    from_author_id: authorIds[(index + 3) % authorIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'COMMENT',
    title: 'Mumin Trollet har kommenterat på Testartikel',
    message: 'Vilken spännande nyhet',
    member_id: memberId,
    from_author_id: authorIds[(index + 4) % authorIds.length],
  }, {
    link: '/news/article/testarticle', // not a valid link
    type: 'COMMENT',
    title: 'Tumme Lisa har kommenterat på Testartikel',
    message: 'Som jag väntat på när denna nyheten skulle komma, vad tycker du @Tumme Lisa?',
    member_id: memberId,
    from_author_id: authorIds[(index + 5) % authorIds.length],
  }]));
}
