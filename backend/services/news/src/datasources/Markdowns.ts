import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class MarkdownsAPI extends dbUtils.KnexDataSource {
  getMarkdown(
    ctx: context.UserContext,
    name: string,
  ): Promise<gql.Maybe<gql.Markdown>> {
    return this.withAccess('news:article:read', ctx, async () => {
      const markdown = await this.knex<sql.Markdown>('markdowns')
        .where({ name })
        .first();
      if (!markdown) {
        return undefined;
      }
      return markdown;
    });
  }

  updateMarkdown(
    ctx: context.UserContext,
    markdownInput: gql.UpdateMarkdown,
    name: string,
  ): Promise<gql.Maybe<gql.Markdown>> {
    return this.withAccess('news:article:read', ctx, async () => {
      await this.knex<sql.Markdown>('markdowns')
        .where({ name })
        .update(markdownInput);
      const markdown = await this.knex<sql.Markdown>('markdowns')
        .where({ name })
        .first();
      if (!markdown) {
        return undefined;
      }
      return markdown;
    });
  }
}
