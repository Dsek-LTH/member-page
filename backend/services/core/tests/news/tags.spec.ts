import { ApolloError } from 'apollo-server';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import 'mocha';
import { convertTag } from '~/src/datasources/News';
import TagsAPI from '~/src/datasources/Tags';
import { knex } from '~/src/shared';
import { Member } from '~/src/types/database';
import { CreateTag } from '~/src/types/graphql';
import * as sql from '~/src/types/news';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createTags: Partial<sql.Tag>[] = [
  {
    name: 'tag1',
    name_en: 'tag1',
    color: '#ff0000',
    is_default: true,
  },
  {
    name: 'tag2',
  },
  {
    name: 'tag3',
  },
];
export default createTags;

let tags: sql.Tag[];
let members: Member[];
let keycloak: any[];

const insertTags = async () => {
  tags = await knex('tags').insert(createTags).returning('*');
  members = await knex('members').insert([{ student_id: 'ab1234cd-s' }, { student_id: 'ef4321gh-s' }, { student_id: 'dat12abc' }]).returning('*');
  keycloak = await knex('keycloak').insert([{ keycloak_id: '0', member_id: members[0].id }, { keycloak_id: '1', member_id: members[1].id }, { keycloak_id: '2', member_id: members[2].id }]).returning('*');
};

const tagsAPI = new TagsAPI(knex);

describe('[TagsAPI]', () => {
  beforeEach(async () => {
    sandbox.on(tagsAPI, 'withAccess', (name, context, fn) => fn());
    await insertTags();
  });

  afterEach(async () => {
    await knex('tags').del();
    await knex('members').del();
    await knex('keycloak').del();
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
      const { name_en: nameEn, ...rest } = tag;
      const updatedTag = {
        nameEn,
        ...rest,
      };
      const res = await tagsAPI.updateTag({}, updatedTag, tag.id);
      expect(res).to.deep.equal(convertTag(tag));
    });
  });

  describe('[getBlacklistedTags]', () => {
    it('returns empty list when no tags are blacklisted', async () => {
      const res = await tagsAPI.getBlacklistedTags({});
      expect(res).to.deep.equal([]);
    });
    it('returns a blacklisted tags', async () => {
      const tag = tags[0];
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[0].id });
      const res = await tagsAPI.getBlacklistedTags({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      });
      expect(res).to.deep.equal([convertTag(tag)]);
    });
    it('returns all blacklisted tags', async () => {
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tags[0].id, member_id: members[0].id });
      await knex('tag_blacklists').insert({ tag_id: tags[1].id, member_id: members[0].id });
      const res = await tagsAPI.getBlacklistedTags({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      });
      expect(res).to.deep.equal([convertTag(tags[0]), convertTag(tags[1])]);
    });
    it('returns only user\'s blacklisted tags', async () => {
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tags[0].id, member_id: members[0].id });
      await knex('tag_blacklists').insert({ tag_id: tags[1].id, member_id: members[0].id });
      await knex('tag_blacklists').insert({ tag_id: tags[2].id, member_id: members[1].id });
      const res = await tagsAPI.getBlacklistedTags({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      });
      expect(res).to.deep.equal([convertTag(tags[0]), convertTag(tags[1])]);
    });
  });

  describe('[blacklistTag]', () => {
    it('blacklists a tag', async () => {
      const tag = tags[0];
      const studentId = members[0].student_id;
      await tagsAPI.blacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag.id, member_id: members[0].id });
      expect(res).to.deep.equal([{ tag_id: tag.id, member_id: members[0].id }]);
    });
    it('blacklists a tag only once', async () => {
      const tag = tags[0];
      const studentId = members[0].student_id;
      await tagsAPI.blacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag.id);
      try {
        await tagsAPI.blacklistTag({
          user: {
            keycloak_id: keycloak[0].id,
            student_id: studentId,
          },
        }, tag.id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
    it('blacklists a tag for multiple users', async () => {
      const tag = tags[0];
      const studentId1 = members[0].student_id;
      const studentId2 = members[1].student_id;
      await tagsAPI.blacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId1,
        },
      }, tag.id);
      await tagsAPI.blacklistTag({
        user: {
          keycloak_id: keycloak[1].id,
          student_id: studentId2,
        },
      }, tag.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag.id });
      expect(res).to.deep.equal([
        { tag_id: tag.id, member_id: members[0].id },
        { tag_id: tag.id, member_id: members[1].id },
      ]);
    });
  });

  describe('[unblacklistTag]', () => {
    it('unblacklists a tag', async () => {
      const tag = tags[0];
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[0].id });
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag.id, member_id: members[0].id });
      expect(res).to.deep.equal([]);
    });
    it('unblacklists a tag only once', async () => {
      const tag = tags[0];
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[0].id });
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag.id);
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag.id, member_id: members[0].id });
      expect(res).to.deep.equal([]);
    });
    it('unblacklists a tag for multiple users', async () => {
      const tag = tags[0];
      const studentId1 = members[0].student_id;
      const studentId2 = members[1].student_id;
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[0].id });
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[1].id });
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId1,
        },
      }, tag.id);
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[1].id,
          student_id: studentId2,
        },
      }, tag.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag.id });
      expect(res).to.deep.equal([]);
    });
    it('doesn\'t unblacklist tag for other users', async () => {
      const tag = tags[0];
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[0].id });
      await knex('tag_blacklists').insert({ tag_id: tag.id, member_id: members[1].id });
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag.id });
      expect(res).to.deep.equal([{ tag_id: tag.id, member_id: members[1].id }]);
    });
    it('doesn\'t unblacklist other tags', async () => {
      const tag1 = tags[0];
      const tag2 = tags[1];
      const studentId = members[0].student_id;
      await knex('tag_blacklists').insert({ tag_id: tag1.id, member_id: members[0].id });
      await knex('tag_blacklists').insert({ tag_id: tag2.id, member_id: members[0].id });
      await tagsAPI.unblacklistTag({
        user: {
          keycloak_id: keycloak[0].id,
          student_id: studentId,
        },
      }, tag1.id);
      const res = await knex('tag_blacklists')
        .select(['tag_id', 'member_id'])
        .where({ tag_id: tag2.id, member_id: members[0].id });
      expect(res).to.deep.equal([{ tag_id: tag2.id, member_id: members[0].id }]);
    });
  });
});
