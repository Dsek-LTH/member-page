/* eslint-disable max-len */
import { ForbiddenError, UserInputError } from 'apollo-server';
import { Mandate, Member } from '~/src/types/database';
import
{
  context,
  dbUtils,
} from '../shared';
import { verifyAccess } from '../shared/database';
import * as sql from '../types/author';
import * as gql from '../types/graphql';
import { convertMember } from './Member';

export const convertAuthor = ({ member, ...author }: sql.Author & {
  member: gql.Maybe<Member>
}, ctx: context.UserContext): gql.Author => ({
  id: author.id,
  member: convertMember({
    ...member,
    id: author.member_id,
  }, ctx) ?? {
    __typename: 'Member',
    id: author.member_id,
  },
  mandate: author.mandate_id ? {
    __typename: 'Mandate',
    id: author.mandate_id,
  } : undefined,
  customAuthor: author.custom_id ? {
    __typename: 'CustomAuthor',
    id: author.custom_id,
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
      .select < sql.Author & { member: Member }>('authors.*', this.knex.raw('to_json(members.*) as member'))
      .join<Member>('members', 'members.id', '=', 'authors.member_id')
      .where({ id: author_id })
      .first();
    if (!author) return undefined;
    return convertAuthor(author, ctx);
  }

  private async getOrCreateAuthor(author: Partial<sql.Author>) {
    const existing = await this.knex<sql.Author>('authors')
      .select('*')
      .where({
        ...author,
      })
      .first();
    if (existing) return existing;
    const newAuthor = await this.knex<sql.Author>('authors')
      .insert({
        ...author,
      })
      .returning('*')
      .then((res) => res[0]);
    return newAuthor;
  }

  async createAuthor(ctx: context.UserContext, authorInput: gql.InputMaybe<gql.CreateAuthor>): Promise<sql.Author> {
    const memberId = await this.getCurrentMemberId(ctx);
    let type: sql.Author['type'] = 'Member';
    if (authorInput?.mandateId) {
      type = 'Mandate';
      // Check that current member has mandate
      const mandate = await this.knex<Mandate>('mandates')
        .select('member_id')
        .where({ id: authorInput.mandateId })
        .first();
      if (!mandate) throw new UserInputError('Mandate does not exist');
      if (mandate.member_id !== memberId) throw new ForbiddenError('Mandate does not belong to current member');
    }
    if (authorInput?.customAuthorId) {
      type = 'Custom';
      // Verify member has access
      const options = await this.getCustomAuthorOptionsForUser(ctx, memberId);
      if (!options.some((customAuthor) => customAuthor.id === authorInput?.customAuthorId)) throw new UserInputError('Custom author does not exist');
    }
    return this.getOrCreateAuthor({
      member_id: memberId,
      mandate_id: authorInput?.mandateId,
      custom_id: authorInput?.customAuthorId,
      type,
    });
  }

  async updateAuthor(ctx: context.UserContext, id: string, authorInput: gql.InputMaybe<gql.CreateAuthor>): Promise<sql.Author> {
    let type: sql.Author['type'] = 'Member';
    const currentAuthor = await this.knex<sql.Author>('authors').select('*').where({ id }).first();
    if (!currentAuthor) throw new UserInputError('Author does not exist');
    if (currentAuthor.mandate_id === authorInput?.mandateId && currentAuthor.custom_id === authorInput?.customAuthorId) return currentAuthor; // No changes made
    if (authorInput?.mandateId) {
      type = 'Mandate';
      // Check that current member has mandate
      const mandate = await this.knex<Mandate>('mandates')
        .select('member_id')
        .where({ id: authorInput.mandateId })
        .first();
      if (!mandate) throw new UserInputError('Mandate does not exist');
      if (mandate.member_id !== currentAuthor.member_id) throw new ForbiddenError('Mandate does not belong to current member');
    }
    if (authorInput?.customAuthorId) {
      type = 'Custom';
      // Check that current member can have custom author
      const options = await this.getCustomAuthorOptionsForUser(ctx, currentAuthor.member_id);
      if (!options.some((customAuthor) => customAuthor.id === authorInput?.customAuthorId)) throw new UserInputError('Custom author does not exist');
    }
    return this.getOrCreateAuthor({
      member_id: currentAuthor.member_id,
      mandate_id: authorInput?.mandateId,
      custom_id: authorInput?.customAuthorId,
      type,
    });
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
    return this.withAccess(['core:admin', 'news:article:update'], ctx, async () => {
      const roles = ctx.roles ?? [];
      const query = this.knex<sql.CustomAuthor>('custom_authors')
        .select('custom_authors.*')
        .join('custom_author_roles', 'custom_author_roles.custom_author_id', '=', 'custom_authors.id')
        .whereIn('custom_author_roles.role', roles)
        .orWhere('custom_author_roles.role', '*');
      if (verifyAccess([{ role: '_' }], ctx)) {
        query.orWhere('custom_author_roles.role', '_');
      }
      const customAuthors = await query.distinct('custom_authors.id');
      return customAuthors.map(convertCustomAuthor);
    }, member_id);
  }
}
