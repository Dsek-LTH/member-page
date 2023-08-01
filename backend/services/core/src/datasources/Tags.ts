import { ApolloError, UserInputError } from 'apollo-server';
import { dbUtils, context, UUID } from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/news';
import { convertTag } from './News';
import { Member as sqlMember } from '~/src/types/database';

export default class TagsAPI extends dbUtils.KnexDataSource {
  getTag(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.Tag>> {
    return this.withAccess('tags:read', ctx, async () => {
      const tag = await dbUtils.unique(this.knex<sql.Tag>('tags').where({ id }));
      if (!tag) {
        return undefined;
      }
      return convertTag(tag);
    });
  }

  getTags(
    ctx: context.UserContext,
  ): Promise<gql.Tag[]> {
    return this.withAccess('tags:read', ctx, async () => {
      const tags = await this.knex<sql.Tag>('tags').orderBy('name');
      return tags.map(convertTag);
    });
  }

  createTag(
    ctx: context.UserContext,
    tagInput: gql.CreateTag,
  ): Promise<gql.Maybe<gql.Tag>> {
    return this.withAccess('tags:create', ctx, async () => {
      const { nameEn, isDefault, ...input } = tagInput;
      const newTag: Omit<sql.Tag, 'id'> = {
        ...input,
        name_en: nameEn,
        is_default: isDefault ?? false,
      };
      const tag = (await this.knex<sql.Tag>('tags').insert(newTag).returning('*'))[0];
      if (!tag) {
        return undefined;
      }
      return convertTag(tag);
    });
  }

  updateTag(
    ctx: context.UserContext,
    tagInput: gql.UpdateTag,
    id: UUID,
  ): Promise<gql.Maybe<gql.Tag>> {
    return this.withAccess('tags:update', ctx, async () => {
      const { nameEn, isDefault, ...rest } = tagInput;
      const fixedTagInput = {
        name_en: nameEn,
        is_default: isDefault,
        ...rest,
      };
      await this.knex<sql.Tag>('tags').where({ id }).update(fixedTagInput);
      const tag = await dbUtils.unique(this.knex<sql.Tag>('tags').where({ id }));
      if (!tag) throw new UserInputError(`tag with id ${id} does not exist`);
      return convertTag(tag);
    });
  }

  getBlacklistedTags(
    ctx: context.UserContext,
  ): Promise<gql.Tag[]> {
    return this.withAccess('tags:read', ctx, async () => {
      const studentId = ctx.user?.student_id;
      if (!studentId) {
        return []; // not logged in
      }
      const tags = await this.knex<sql.Tag>('tag_blacklists')
        .select('tags.*')
        .join('members', 'members.id', '=', 'tag_blacklists.member_id')
        .join('tags', 'tags.id', '=', 'tag_blacklists.tag_id')
        .where({ 'members.student_id': studentId });
      return tags.map(convertTag);
    });
  }

  blacklistTag(
    ctx: context.UserContext,
    tagId: UUID,
  ): Promise<gql.Maybe<gql.Tag>> {
    return this.withAccess('tags:blacklist', ctx, async () => {
      const studentId = ctx.user?.student_id;
      if (!studentId) {
        throw new ApolloError('no student_id');
      }
      const memberPromise = dbUtils.unique(this.knex<sqlMember>('members').where({ student_id: studentId }));
      const tagPromise = dbUtils.unique(this.knex<sql.Tag>('tags').where({ id: tagId }));
      const [member, tag] = await Promise.all([memberPromise, tagPromise]);
      if (!member) {
        throw new UserInputError(`member with student_id ${studentId} does not exist`);
      }
      if (!tag) {
        throw new UserInputError(`tag with id ${tagId} does not exist`);
      }
      const blacklist: Omit<sql.TagBlacklist, 'id' | 'created_at'> = {
        tag_id: tag.id,
        member_id: member.id,
      };
      try {
        await this.knex<sql.TagBlacklist>('tag_blacklists').insert(blacklist);
      } catch (e: any) {
        if (e?.code === dbUtils.UniqueConstraintViolation) {
          throw new ApolloError('Tag already blacklisted');
        }
        throw e;
      }
      return convertTag(tag);
    });
  }

  unblacklistTag(
    ctx: context.UserContext,
    tagId: UUID,
  ): Promise<gql.Maybe<gql.Tag>> {
    return this.withAccess('tags:blacklist', ctx, async () => {
      const studentId = ctx.user?.student_id;
      if (!studentId) {
        throw new ApolloError('no student_id');
      }
      const memberPromise = dbUtils.unique(this.knex<sqlMember>('members').where({ student_id: studentId }));
      const tagPromise = dbUtils.unique(this.knex<sql.Tag>('tags').where({ id: tagId }));
      const [member, tag] = await Promise.all([memberPromise, tagPromise]);
      if (!member) {
        throw new UserInputError(`member with student_id ${studentId} does not exist`);
      }
      if (!tag) {
        throw new UserInputError(`tag with id ${tagId} does not exist`);
      }
      await this.knex<sql.TagBlacklist>('tag_blacklists')
        .where({ tag_id: tag.id, member_id: member.id })
        .delete();
      return convertTag(tag);
    });
  }
}
