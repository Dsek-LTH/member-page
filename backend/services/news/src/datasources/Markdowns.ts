import { dbUtils, context } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export default class MarkdownsAPI extends dbUtils.KnexDataSource {
  getMarkdown(
    ctx: context.UserContext,
    name: string,
  ): Promise<gql.Maybe<gql.Markdown>> {
    return this.withAccess('markdowns:read', ctx, async () => {
      const markdown = await this.knex<sql.Markdown>('markdowns')
        .where({ name })
        .first();
      if (!markdown) {
        return undefined;
      }
      return markdown;
    });
  }

  getMarkdowns(
    ctx: context.UserContext,
  ): Promise<gql.Markdown[]> {
    return this.withAccess('markdowns:read', ctx, async () => {
      const markdowns = await this.knex<sql.Markdown>('markdowns');
      return markdowns;
    });
  }

  createMarkdown(
    ctx: context.UserContext,
    markdownInput: gql.CreateMarkdown,
  ): Promise<gql.Maybe<gql.Markdown>> {
    return this.withAccess('markdowns:create', ctx, async () => {
      await this.knex<sql.Markdown>('markdowns').insert({ name: markdownInput.name, markdown: markdownInput.markdown || '', markdown_en: markdownInput.markdown_en || '' });
      const markdown = await this.knex<sql.Markdown>('markdowns')
        .where({ name: markdownInput.name })
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
    return this.withAccess('markdowns:update', ctx, async () => {
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
