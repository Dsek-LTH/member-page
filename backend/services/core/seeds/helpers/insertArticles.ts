import { Knex } from 'knex';
import { Article } from '~/src/types/news';
import { getOrCreateAuthor, slugify } from '../../src/shared/utils';

// Genereates a random datetime between today and 5 years ago
const randomDate = () => {
  const date = new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000));
  return date;
};
const generateArticle = (title: string, body: string) => {
  const base = {
    header: title,
    body,
    published_datetime: randomDate(),
    slug: slugify(title),
  };
  // So only some have english translations
  if (Math.random() > 0.2) {
    return {
      ...base,
      body_en: `EN: ${body}`,
      header_en: `EN: ${title}`,
    };
  }
  return base;
};
const titles = [
  'Detta är en nyhet',
  'Detta är en annan nyhet',
  'Wow här kommer lite viktig information, kanske',
  'Detta är en väldigt lång titel som kan pågå ett tag och behöver se snygg ut ändå',
  'Nyhet',
  'Min livshistoria med mera',
];
const longBody = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor urna nec lorem gravida, a vestibulum metus ullamcorper. Suspendisse potenti. Nullam sit amet venenatis arcu. Sed ultrices nibh a ex euismod congue. Proin feugiat felis ut augue volutpat, nec efficitur elit fermentum. Sed et felis id turpis condimentum faucibus eu vel ex. Fusce lacinia nisi vel sapien malesuada, nec fringilla dui vulputate. Sed quis ultrices purus. Nullam nec nunc ac ipsum laoreet suscipit.

Maecenas non justo eget augue lacinia luctus in non velit. Donec auctor libero eget tellus imperdiet, a ultricies purus cursus. Praesent pharetra, neque in rhoncus ultricies, enim turpis sodales elit, non laoreet ex ligula eget turpis. Aenean eget velit non lectus luctus volutpat eget id purus. Suspendisse bibendum sapien nec orci tincidunt feugiat. Maecenas et urna vel odio blandit mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam nec facilisis lectus. Vivamus egestas tortor ut arcu lacinia luctus. Sed ac enim ac justo mattis elementum vel ut sem.

Fusce ultricies orci sit amet arcu laoreet auctor. Duis rhoncus, justo nec pellentesque hendrerit, tortor massa gravida odio, a ultrices nisi nisi et justo. Etiam in sapien ut elit tincidunt faucibus. Sed sit amet libero eget erat bibendum efficitur. Vivamus non pharetra ipsum, non tempus tortor. Sed nec volutpat ligula. Pellentesque consectetur lacus vel dolor fermentum, nec tempor ex iaculis. Nullam volutpat risus ac magna viverra, eu ultricies ex volutpat. Nunc laoreet velit in nunc posuere, nec convallis arcu rhoncus. Morbi id volutpat metus. Quisque luctus, risus in facilisis blandit, sapien mi varius nulla, vel iaculis arcu metus et libero. Integer eu sagittis justo. Sed at urna bibendum, scelerisque odio et, tincidunt arcu. Nullam ullamcorper urna sit amet orci cursus, id sollicitudin quam vehicula.
`;
const bodies = [
  'Detta är mer ingående information om nyheten.',
  'I den här artikeln kommer vi att diskutera olika aspekter av ämnet.',
  'Vi har sammanställt viktig information som du bör känna till.',
  'Låt oss utforska detaljerna i denna spännande händelse.',
  'Här är en översikt av den senaste utvecklingen inom ämnet.',
  'Läs vidare för att ta del av min intressanta livshistoria och upplevelser.',
  longBody,
];

const getMemberAuthorIds = async (knex: Knex, count: number) => {
  const members = await knex('members').select('id').limit(count);
  return (await Promise.all(
    members.map((member) => getOrCreateAuthor(knex, {
      member_id: member.id,
      type: 'Member',
    })),
  )).map((author) => author.id);
};

const getMandateAuthorIds = async (knex: Knex, count: number) => {
  const mandates = await knex('mandates').select(['mandates.id', 'mandates.member_id']).limit(count)
    .andWhereRaw('CURRENT_DATE BETWEEN start_date AND end_date'); // only active mandates
  return (await Promise.all(
    mandates.map((mandate) => getOrCreateAuthor(knex, {
      member_id: mandate.member_id,
      mandate_id: mandate.id,
      type: 'Mandate',
    })),
  )).map((author) => author.id);
};

const getCustomAuthorIds = async (knex: Knex, count: number) => {
  const data = await knex('custom_authors')
    .select(['mandates.member_id', 'custom_authors.id', 'positions.board_member'])
    .join('custom_author_roles', 'custom_authors.id', '=', 'custom_author_roles.custom_author_id')
    .joinRaw('JOIN mandates on mandates.position_id LIKE CONCAT(\'%\',custom_author_roles.role,\'%\')')
    .join('positions', 'positions.id', '=', 'position_id')
    .join('members', 'members.id', '=', 'mandates.member_id')
    .whereRaw('CURRENT_DATE BETWEEN start_date AND end_date');
  const notBoard = data.filter((v) => !v.board_member).slice(0, count - 1);
  const board = data.filter((v) => v.board_member)[0];
  const customAuthorIds = (await Promise.all([
    ...notBoard.map((v) => getOrCreateAuthor(knex, ({
      member_id: v.member_id,
      custom_id: v.id,
      type: 'Custom' as const,
    }))),
    getOrCreateAuthor(knex, {
      member_id: board.member_id,
      custom_id: board.id,
      type: 'Custom',
    })])).map((author) => author.id);
  return customAuthorIds;
};
type CreateArticleInfo = Omit<Article, 'id' | 'created_datetime' | 'status' | 'author'> & Partial<Pick<Article, 'status'>>;
const articles = (authorIds: string[]): CreateArticleInfo[] =>
  authorIds.map((authorId, index) => ({
    ...generateArticle(
      `${titles[Math.floor(Math.random() * titles.length)]} ${index}`,
      bodies[Math.floor(Math.random() * bodies.length)],
    ),
    author_id: authorId,
    status: index === 0 ? 'draft' : undefined,
  }));

/**
 * Will generate articles, one for each authorId provideds
 */
export default async function insertArticles(
  knex: Knex,
): Promise<string[]> {
  const authorIds = [];
  authorIds.push(...await getMemberAuthorIds(knex, 5));
  authorIds.push(...await getMandateAuthorIds(knex, 8));
  authorIds.push(...await getCustomAuthorIds(knex, 3));
  return (await knex<Article>('articles').insert(
    articles(authorIds),
  ).returning('id')).map((v) => v.id);
}
