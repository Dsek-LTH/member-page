import {
  UUID,
  context,
  dbUtils,
} from '../shared';

import * as gql from '../types/graphql';
import * as sql from '../types/governingDocuments';

const TABLE_NAME = 'governing_documents';

export function convertGoverningDocument(document: sql.GoverningDocument): gql.GoverningDocument {
  return {
    id: document.id,
    title: document.title,
    url: document.url,
    type: document.document_type,
  };
}

export default class GoverningDocumentsAPI extends dbUtils.KnexDataSource {
  getGoverningDocument(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.GoverningDocument>> {
    return this.withAccess('governing_document:read', ctx, async () => {
      const document = await this.knex<sql.GoverningDocument>(TABLE_NAME).where({ id }).first();
      return document ? convertGoverningDocument(document) : undefined;
    });
  }

  getGoverningDocuments(
    ctx: context.UserContext,
  ): Promise<gql.GoverningDocument[]> {
    return this.withAccess('governing_document:read', ctx, async () => {
      const documents = await this.knex<sql.GoverningDocument>(TABLE_NAME)
        .whereNull('deleted_at');
      return documents.map(convertGoverningDocument);
    });
  }

  getPolicies(
    ctx: context.UserContext,
  ): Promise<gql.GoverningDocument[]> {
    return this.withAccess('governing_document:read', ctx, async () => {
      const documents = await this.knex<sql.GoverningDocument>(TABLE_NAME)
        .where({ document_type: sql.GoverningDocumentType.Policy })
        .whereNull('deleted_at');
      return documents.map(convertGoverningDocument);
    });
  }

  getGuidelines(
    ctx: context.UserContext,
  ): Promise<gql.GoverningDocument[]> {
    return this.withAccess('governing_document:read', ctx, async () => {
      const documents = await this.knex<sql.GoverningDocument>(TABLE_NAME)
        .where({ document_type: sql.GoverningDocumentType.Guideline })
        .whereNull('deleted_at');
      return documents.map(convertGoverningDocument);
    });
  }

  createGoverningDocument(
    ctx: context.UserContext,
    input: gql.CreateGoverningDocument,
  ): Promise<gql.Maybe<gql.GoverningDocument>> {
    return this.withAccess('governing_document:write', ctx, async () => {
      const document = (await this.knex<sql.GoverningDocument>(TABLE_NAME).insert({
        title: input.title,
        url: input.url,
        // @ts-ignore
        document_type: input.type,
      }).returning('*'))[0];
      return convertGoverningDocument(document);
    });
  }

  updateGoverningDocument(
    ctx: context.UserContext,
    input: gql.UpdateGoverningDocument,
  ): Promise<gql.Maybe<gql.GoverningDocument>> {
    return this.withAccess('governing_document:write', ctx, async () => {
      const document = (await this.knex<sql.GoverningDocument>(TABLE_NAME)
        .where({ id: input.id }).update({
          title: input.title,
          url: input.url,
          // @ts-ignore
          document_type: input.type,
        }).returning('*'))[0];
      return convertGoverningDocument(document);
    });
  }

  deleteGoverningDocument(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<boolean>> {
    return this.withAccess('governing_document:write', ctx, async () => {
      const document = (await this.knex<sql.GoverningDocument>(TABLE_NAME)
        .where({ id }));
      if (!document) return false;
      await this.knex<sql.GoverningDocument>(TABLE_NAME)
        .where({ id })
        .update({ deleted_at: new Date() });
      return !!document;
    });
  }
}
