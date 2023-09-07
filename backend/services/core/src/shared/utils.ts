import { Knex } from 'knex';
import type { Author, CustomAuthor } from '../types/author';
import type { Member } from '../types/database';
import * as gql from '../types/graphql';

// eslint-disable-next-line import/prefer-default-export
export function slugify(title: string) {
  let slug = title.replace(/^\s+|\s+$/g, ''); // trim
  slug = slug.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åäöø·/_,:;';
  const to = 'aaoo------';
  for (let i = 0, l = from.length; i < l; i += 1) {
    slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  slug = slug
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return slug;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export const getFullName = (
  member: Member | gql.Member,
  showNickname: boolean = true,
): string => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { first_name, nickname, last_name } = member;
  if (!first_name && !last_name) return nickname ?? 'Någon';
  if (!nickname && !last_name) return first_name!;
  if (!nickname && !first_name) return last_name!;
  if (nickname && showNickname) return `${first_name} "${nickname}" ${last_name}`;
  return `${first_name} ${last_name}`;
};

export const getAuthorSignature = (author: Author & {
  member: Member | gql.Member,
  customAuthor?: CustomAuthor
}): string => {
  if (author.type === 'Member') return getFullName(author.member);
  if (author.type === 'Mandate') return getFullName(author.member);
  if (author.type === 'Custom') return author?.customAuthor?.name ?? getFullName(author.member);
  return 'Någon';
};

export const getOrCreateAuthor = async (knex: Knex, { type, ...rest }: Partial<Author>) => {
  const cleanRest = Object.entries(rest).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {} as Record<string, any>);

  const existing = await knex<Author>('authors')
    .select('*')
    .where({
      type,
      ...cleanRest,
    })
    .first();
  if (existing) return existing;
  const newAuthor = await knex<Author>('authors')
    .insert({
      ...rest, // type is inferred
    })
    .returning('*')
    .then((res) => res[0]);
  return newAuthor;
};
