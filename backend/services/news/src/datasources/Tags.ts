import { dbUtils, context, UUID } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import * as gql from '../types/graphql';
import * as sql from '../types/database';
import { convertTag } from './News';

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
      const tags = await this.knex<sql.Tag>('tags');
      return tags.map(convertTag);
    });
  }

  createTag(
    ctx: context.UserContext,
    tagInput: gql.CreateTag,
  ): Promise<gql.Maybe<gql.Tag>> {
    return this.withAccess('tags:create', ctx, async () => {
      const { nameEn, ...input } = tagInput;
      const newTag : Omit<sql.Tag, 'id'> = {
        ...input,
        name_en: nameEn,
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
      await this.knex<sql.Tag>('tags').where({ id }).update(tagInput);
      const tag = await dbUtils.unique(this.knex<sql.Tag>('tags').where({ id }));
      if (!tag) throw new UserInputError(`tag with id ${id} does not exist`);
      return convertTag(tag);
    });
  }
}
