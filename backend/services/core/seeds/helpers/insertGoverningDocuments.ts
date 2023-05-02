import { Knex } from 'knex';
import { GoverningDocument, GoverningDocumentType } from '../../src/types/governingDocuments';

export default async function insertGoverningDocuments(
  knex: Knex,
) {
  await knex<GoverningDocument>('governing_documents').insert([
    {
      title: 'Policy för ekonomirutiner',
      url: 'https://github.com/Dsek-LTH/policys/releases/download/latest/policy_for_ekonomirutiner.pdf',
      document_type: GoverningDocumentType.Policy,
    },
    {
      title: 'Riktlinje för informationsspridning',
      url: 'https://github.com/Dsek-LTH/policys/releases/download/latest/policy_for_informationsspridning.pdf',
      document_type: GoverningDocumentType.Guideline,
    },
  ]);
}
