import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import CommitteeAPI, { convertCommittee } from '../src/datasources/Committee';
import { Committee, CreateCommittee } from '../src/types/database';
import { CommitteeFilter } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createCommittees: CreateCommittee[] = [
  { name: 'Informationsutskottet', name_en: 'Communications committee' },
  { name: 'Näringslivsutskottet', name_en: 'Corporate Relations committee' },
  { name: 'Skattmästeriet' },
];

const committeeAPI = new CommitteeAPI(knex);

let committees: Committee[] = [];

const insertCommittees = async () => {
  committees = await knex('committees').insert(createCommittees).returning('*');
};

describe('[CommitteeAPI]', () => {
  beforeEach(() => {
    sandbox.on(committeeAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('committees').del();
    sandbox.restore();
  });

  describe('[getCommittees]', () => {
    const page = 0;
    const perPage = 10;
    const info = {
      totalPages: 1,
      page,
      perPage,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    it('returns all committees on undefined filter', async () => {
      await insertCommittees();
      const res = await committeeAPI.getCommittees({ language: 'sv' }, page, perPage);
      const expected = {
        committees: committees.map((c) => convertCommittee(c, 'sv')),
        pageInfo: {
          totalItems: createCommittees.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(expected);
    });

    it('returns all committees with correct translation', async () => {
      await insertCommittees();
      const res = await committeeAPI.getCommittees({ language: 'en' }, page, perPage);
      expect(res.committees).to.deep.equal(committees.map((c) => convertCommittee(c, 'en')));
    });

    it('returns filtered committees', async () => {
      await insertCommittees();
      const filter: CommitteeFilter = { id: committees[0].id };
      const filtered = [committees[0]];
      const res = await committeeAPI.getCommittees({ language: 'sv' }, page, perPage, filter);
      const expected = {
        committees: filtered.map((c) => convertCommittee(c, 'sv')),
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(expected);
    });

    it('returns no committees', async () => {
      await insertCommittees();
      const filter: CommitteeFilter = { id: '277af107-7363-49c7-82aa-426449e18206' };
      const filtered: Committee[] = [];
      const res = await committeeAPI.getCommittees({ language: 'sv' }, page, perPage, filter);
      const expected = {
        committees: filtered.map((c) => convertCommittee(c, 'sv')),
        pageInfo: {
          ...info,
          totalItems: filtered.length,
          totalPages: 0,
        },
      };
      expect(res).to.deep.equal(expected);
    });
  });

  describe('[getCommittee]', () => {
    it('returns single committee', async () => {
      await insertCommittees();
      const res = await committeeAPI.getCommittee({ language: 'sv' }, { id: committees[0].id });
      expect(res).to.deep.equal(convertCommittee(committees[0], 'sv'));
    });

    it('returns a committee in english', async () => {
      await insertCommittees();
      const res = await committeeAPI.getCommittee({ language: 'en' }, { id: committees[1].id });
      expect(res).to.deep.equal(convertCommittee(committees[1], 'en'));
    });

    it('returns committee in swedish if translation is missing', async () => {
      await insertCommittees();
      const res = await committeeAPI.getCommittee({ language: 'en' }, { id: committees[2].id });
      expect(res).to.deep.equal(convertCommittee(committees[2], 'sv'));
    });

    it('returns no committee on no match', async () => {
      await insertCommittees();
      const res = await committeeAPI.getCommittee({ language: 'sv' }, { id: '277af107-7363-49c7-82aa-426449e18206' });
      expect(res).to.deep.equal(undefined);
    });
  });

  describe('[createCommittee]', () => {
    const createCommittee = {
      name: 'created',
    };

    it('creates committee', async () => {
      const res = await committeeAPI.createCommittee({ language: 'sv' }, createCommittee);
      expect(res).to.deep.equal({ id: res?.id, ...createCommittee });
    });
  });

  describe('[updateCommittee]', () => {
    const updateCommittee = {
      name: 'updated',
      name_en: 'updated en',
    };

    it('throws an error if id is missing', async () => {
      try {
        await committeeAPI.updateCommittee({ language: 'sv' }, '277af107-7363-49c7-82aa-426449e18206', updateCommittee);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates committee', async () => {
      await insertCommittees();
      const { id } = committees[0];
      const res = await committeeAPI.updateCommittee({ language: 'sv' }, id, updateCommittee);
      expect(res).to.deep.equal({ id, name: updateCommittee.name });
    });
  });

  describe('[removeCommittee]', () => {
    it('throws an error if id is missing', async () => {
      await insertCommittees();
      try {
        await committeeAPI.removeCommittee({ language: 'sv' }, '277af107-7363-49c7-82aa-426449e18206');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes committee', async () => {
      await insertCommittees();
      const res = await committeeAPI.removeCommittee({ language: 'sv' }, committees[0].id);
      expect(res).to.deep.equal(convertCommittee(committees[0], 'sv'));
      const committee = await committeeAPI.getCommittee({ language: 'sv' }, { id: committees[0].id });
      expect(committee).to.be.undefined;
    });
  });
});
