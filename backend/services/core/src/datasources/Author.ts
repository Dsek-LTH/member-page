/* eslint-disable max-len */
import { Member } from '~/src/types/database';
import
{
  context,
  dbUtils,
} from '../shared';
import { verifyAccess } from '../shared/database';
import * as sql from '../types/author';
import * as gql from '../types/graphql';

export const convertAuthor = (author: sql.Author & Partial<Member>): gql.Author => ({
  id: author.id,
  member: {
    id: author.member_id,
    student_id: author.student_id,
    first_name: author.first_name,
    nickname: author.nickname,
    last_name: author.last_name,
    picture_path: author.picture_path,
    class_year: author.class_year,
    class_programme: author.class_programme,
  },
  mandate: author.mandate_id ? {
    id: author.mandate_id,
    start_date: '',
    end_date: '',
  } : undefined,
  customAuthor: author.custom_id ? {
    id: author.custom_id,
    name: '',
    nameEn: '',
  } : undefined,
  type: author.type,
});
export const convertCustomAuthor = (author: sql.CustomAuthor): gql.CustomAuthor => ({
  id: author.id,
  name: author.name,
  nameEn: author.name_en,
  imageUrl: author.image_url,
});

export default class AuthorAPI extends dbUtils.KnexDataSource {
  async getAuthor(ctx: context.UserContext, author_id: string): Promise<gql.Maybe<gql.Author>> {
    const author = await this.knex<sql.Author>('authors')
      .select('*')
      .join<Member>('members', 'members.id', '=', 'authors.member_id')
      .where({ id: author_id })
      .first();
    if (!author) return undefined;
    return convertAuthor(author);
  }

  async createAuthor(ctx: context.UserContext, authorInput: gql.InputMaybe<gql.CreateAuthor>): Promise<sql.Author> {
    const memberId = await this.getCurrentMemberId(ctx);
    let type: sql.Author['type'] = 'Member';
    if (authorInput?.mandateId) type = 'Mandate';
    if (authorInput?.customAuthorId) type = 'Custom';
    const author = await this.knex<sql.Author>('authors')
      .insert({
        member_id: memberId,
        mandate_id: authorInput?.mandateId,
        custom_id: authorInput?.customAuthorId,
        type,
      })
      .returning('*')
      .then((res) => res[0]);
    return author;
  }

  async updateAuthor(ctx: context.UserContext, id: string, authorInput: gql.InputMaybe<gql.CreateAuthor>): Promise<sql.Author> {
    let type: sql.Author['type'] = 'Member';
    if (authorInput?.mandateId) type = 'Mandate';
    if (authorInput?.customAuthorId) type = 'Custom';
    const author = await this.knex<sql.Author>('authors')
      .update({
        mandate_id: authorInput?.mandateId,
        custom_id: authorInput?.customAuthorId,
        type,
      })
      .where({ id })
      .returning('*')
      .then((res) => res[0]);
    return author;
  }

  async getCustomAuthor(ctx: context.UserContext, custom_id: string): Promise<gql.Maybe<gql.CustomAuthor>> {
    const customAuthor = await this.knex<sql.CustomAuthor>('custom_authors')
      .select('*')
      .where({ id: custom_id })
      .first();
    if (!customAuthor) return undefined;
    return convertCustomAuthor(customAuthor);
  }

  async getAllCustomAuthors(ctx: context.UserContext): Promise<gql.CustomAuthor[]> {
    return this.withAccess('core:admin', ctx, async () => {
      const customAuthors = await this.knex<sql.CustomAuthor>('custom_authors')
        .select('*');
      return customAuthors.map(convertCustomAuthor);
    });
  }

  async getCustomAuthorOptionsForUser(ctx: context.UserContext, member_id: string): Promise<gql.CustomAuthor[]> {
    return this.withAccess('core:admin', ctx, async () => {
      const roles = ctx.roles ?? [];
      const query = this.knex<sql.CustomAuthor>('custom_authors')
        .select('*')
        .join('custom_author_roles', 'custom_author_roles.custom_author_id', '=', 'custom_authors.id')
        .whereIn('custom_author_roles.role', roles)
        .orWhere('custom_author_roles.role', '*');
      if (verifyAccess([{ role: '_' }], ctx)) {
        query.orWhere('custom_author_roles.role', '_');
      }
      const customAuthors = await query;
      return customAuthors.map(convertCustomAuthor);
    }, member_id);
  }
}
