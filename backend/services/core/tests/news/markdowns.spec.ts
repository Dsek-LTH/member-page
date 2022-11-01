import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from '../../src/shared';
import MarkdownsAPI from '../../src/datasources/Markdowns';
import * as sql from '../../src/types/news';
import { CreateMarkdown } from '../../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createMarkdowns: Partial<sql.Markdown>[] = [
  {
    name: 'cafe',
    markdown: 'Här finns det information om kaféet',
    markdown_en: 'Here you can find information about the café',
  },
  {
    name: 'dsek.infu',
    markdown: 'information om oss på infU',
  },
  {
    name: 'dsek.aktu',
    markdown: 'information om oss på aktu',
  },
];

let markdowns: sql.Markdown[];

const insertMarkdowns = async () => {
  markdowns = await knex('markdowns')
    .insert(createMarkdowns)
    .returning('*');
};

const markdownsAPI = new MarkdownsAPI(knex);

describe('[MarkdownsAPI]', () => {
  beforeEach(() => {
    sandbox.on(markdownsAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('markdowns').del();
    sandbox.restore();
  });

  describe('[getMarkdowns]', () => {
    it('returns all markdowns', async () => {
      await insertMarkdowns();
      const res = await markdownsAPI.getMarkdowns({});
      expect(res).to.deep.equal(
        markdowns,
      );
    });
  });

  describe('[getMarkdown]', () => {
    it('returns a single markdown', async () => {
      await insertMarkdowns();
      const markdown = markdowns[1];
      const res = await markdownsAPI.getMarkdown({}, markdown.name);
      expect(res).to.deep.equal(markdown);
    });

    it('returns undefined if name does not exist', async () => {
      const res = await markdownsAPI.getMarkdown(
        {},
        'non-existing-name',
      );
      expect(res).to.be.undefined;
    });
  });

  describe('[createMarkdown]', () => {
    it('creates a markdown and returns it', async () => {
      await insertMarkdowns();
      const markdown: CreateMarkdown = { name: 'dsek.nollu', markdown: 'information från nollU!' };
      const res = (await markdownsAPI.createMarkdown(
        {},
        markdown,
      )) ?? expect.fail('res is undefined');
      expect(res).to.deep.equal({ ...markdown, markdown_en: '' });
    });

    it('creates a markdown with english and returns it', async () => {
      await insertMarkdowns();
      const markdown: CreateMarkdown = { name: 'dsek.nollu', markdown: 'information från nollU!', markdown_en: 'information from nollU!' };
      const res = (await markdownsAPI.createMarkdown(
        {},
        markdown,
      )) ?? expect.fail('res is undefined');
      expect(res).to.deep.equal(markdown);
    });

    it('creates a markdown with only a name', async () => {
      await insertMarkdowns();
      const name = 'dsek.nollu';
      const res = (await markdownsAPI.createMarkdown(
        {},
        { name },
      )) ?? expect.fail('res is undefined');
      expect(res).to.deep.equal({ name, markdown: '', markdown_en: '' });
    });
  });

  describe('[updateMarkdown]', () => {
    it('updates and returns a markdown', async () => {
      await insertMarkdowns();
      const markdown = markdowns[0];
      const newBody = 'uppdaterad';
      const res = await markdownsAPI.updateMarkdown({}, { markdown: newBody }, markdown.name);
      expect(res).to.deep.equal({ ...markdown, markdown: newBody });
    });

    it('updates with english translations', async () => {
      await insertMarkdowns();
      const markdown = markdowns[0];
      const newBody = 'uppdaterad';
      const newBodyEn = 'updated';
      const res = await markdownsAPI.updateMarkdown({}, { markdown: newBody, markdown_en: 'updated' }, markdown.name);
      expect(res).to.deep.equal({ ...markdown, markdown: newBody, markdown_en: newBodyEn });
    });

    it('updates only english translations', async () => {
      await insertMarkdowns();
      const markdown = markdowns[0];
      const newBodyEn = 'updated';
      const res = await markdownsAPI.updateMarkdown({}, { markdown_en: 'updated' }, markdown.name);
      expect(res).to.deep.equal({ ...markdown, markdown_en: newBodyEn });
    });
  });
});
