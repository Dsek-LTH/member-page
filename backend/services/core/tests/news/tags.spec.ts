import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { knex } from '~/src/shared';
import 'mocha';
import { convertTag } from '~/src/datasources/News';
import TagsAPI from '~/src/datasources/Tags';
import * as sql from '~/src/types/news';
import { CreateTag } from '~/src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createTags: Partial<sql.Tag>[] = [
  {
    name: 'tag1',
    name_en: 'tag1',
    color: '#ff0000',
    icon: 'edit',
  },
  {
    name: 'tag2',
  },
];
export default createTags;

let tags: sql.Tag[];

const insertTags = async () => {
  tags = await knex('tags').insert(createTags).returning('*');
};

const tagsAPI = new TagsAPI(knex);

describe('[TagsAPI]', () => {
  beforeEach(async () => {
    sandbox.on(tagsAPI, 'withAccess', (name, context, fn) => fn());
    await insertTags();
  });

  afterEach(async () => {
    await knex('tags').del();
    sandbox.restore();
  });

  describe('[getTags]', () => {
    it('returns all tags', async () => {
      const res = await tagsAPI.getTags({});
      expect(res).to.deep.equal(tags.map(convertTag));
    });
  });

  describe('[createTag]', () => {
    it('creates a tag and returns it', async () => {
      const name = 'tagg3';
      const newTag: CreateTag = {
        name,
      };

      const res = await tagsAPI.createTag({}, newTag)
        ?? expect.fail('res is undefined');

      expect(res.name).to.equal(name);
      expect(res.nameEn).to.equal(name);
    });

    it('creates a tag with english and returns it', async () => {
      const name = 'tagg3';
      const nameEn = 'tag3';
      const newTag = {
        name,
        nameEn,
      };

      const res = await tagsAPI.createTag({}, newTag)
        ?? expect.fail('res is undefined');

      expect(res.name).to.equal(name);
      expect(res.nameEn).to.equal(nameEn);
    });
  });

  describe('[updateTag]', () => {
    it('updates and returns a tag', async () => {
      const tag = tags[0];
      const { name_en, ...rest } = tag;
      const updatedTag = {
        nameEn: name_en,
        ...rest,
      };
      const res = await tagsAPI.updateTag({}, updatedTag, tag.id);
      expect(res).to.deep.equal(convertTag(tag));
    });
  });
});
