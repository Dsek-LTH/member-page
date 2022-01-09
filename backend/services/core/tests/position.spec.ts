import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { knex } from 'dsek-shared';
import { UserInputError } from 'apollo-server';
import PositionAPI, { convertPosition } from '../src/datasources/Position';
import * as sql from '../src/types/database';
import kcClient from '../src/keycloak';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const partialPositions: Partial<sql.Position>[] = [
  { id: 'dsek.infu.dwww.medlem', name: 'test', name_en: 'test_en' },
  { id: 'dsek.infu.fotograf', name: 'test2', name_en: 'test2_en' },
  { id: 'dsek.infu.mastare', name: 'test3' },
];

const createCommittees: sql.CreateCommittee[] = [
  { name: 'test', name_en: 'test_en' },
  { name: 'test2', name_en: 'test_en2' },
];

let committees: sql.Committee[] = [];
let positions: sql.Position[] = [];

const insertPositions = async () => {
  committees = await knex('committees').insert(createCommittees).returning('*');
  positions = await knex('positions').insert(partialPositions.map((p, i) => ({ ...p, committee_id: (i) ? committees[1].id : committees[0].id }))).returning('*');
};

const positionAPI = new PositionAPI(knex);

describe('[PositionAPI]', () => {
  beforeEach(() => {
    sandbox.on(positionAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('positions').del();
    await knex('committees').del();
    sandbox.restore();
  });

  describe('[getPositions]', () => {
    const page = 0;
    const perPage = 20;
    const info = {
      totalPages: 1,
      page,
      perPage,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    it('returns all positions', async () => {
      await insertPositions();
      const res = await positionAPI.getPositions({}, page, perPage);
      const expected = {
        positions: positions.map((p) => convertPosition(p, false)),
        pageInfo: {
          totalItems: positions.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(expected);
    });

    it('returns all positions with correct translation', async () => {
      await insertPositions();
      sandbox.on(positionAPI, 'isEnglish', () => true);
      const res = await positionAPI.getPositions({}, page, perPage);
      expect(res.positions).to.deep.equal(positions.map((c) => convertPosition(c, true)));
    });

    it('returns filtered positions', async () => {
      await insertPositions();
      const filter = { committee_id: committees[1].id };
      const filtered = [positions[1], positions[2]];
      const res = await positionAPI.getPositions({}, page, perPage, filter);
      const expected = {
        positions: filtered.map((p) => convertPosition(p, false)),
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(expected);
    });
  });

  describe('[getPosition]', () => {
    it('returns single position', async () => {
      await insertPositions();
      const res = await positionAPI.getPosition({}, { id: 'dsek.infu.dwww.medlem' });
      expect(res).to.deep.equal(convertPosition(positions[0], false));
    });

    it('returns a committee in english', async () => {
      await insertPositions();
      sandbox.on(positionAPI, 'isEnglish', () => true);
      const res = await positionAPI.getPosition({}, { id: positions[0].id });
      expect(res).to.deep.equal(convertPosition(positions[0], true));
    });

    it('returns committee in swedish if translation is missing', async () => {
      await insertPositions();
      sandbox.on(positionAPI, 'isEnglish', () => true);
      const res = await positionAPI.getPosition({}, { id: positions[2].id });
      expect(res).to.deep.equal(convertPosition(positions[2], false));
    });

    it('returns no position on multiple matches', async () => {
      await insertPositions();
      const res = await positionAPI.getPosition({}, { committee_id: 'fb26cc7e-cff6-4b6d-a01b-2f46acd53109' });
      expect(res).to.deep.equal(undefined);
    });

    it('returns no position on no match', async () => {
      await insertPositions();
      const res = await positionAPI.getPosition({}, { committee_id: 'fb26cc7e-cff6-4b6d-a01b-2f46acd53104' });
      expect(res).to.deep.equal(undefined);
    });
  });

  describe('[createPosition]', () => {
    const id = 'dsek.new';
    const createPosition = {
      id,
      name: 'created',
      name_en: 'created_en',
    };

    it('creates position if group exists in keycloak', async () => {
      await insertPositions();
      sandbox.on(kcClient, 'createPosition', () => true);

      const res = await positionAPI.createPosition({}, { ...createPosition, committee_id: committees[0].id, email: '' });
      expect(kcClient.createPosition).to.have.been.called.once.with(id);

      expect(res).to.deep.equal(convertPosition({
        ...createPosition, committee_id: committees[0].id, active: true, email: '', board_member: false,
      }, false));
    });

    it('creates and removes position if group does not exists in keycloak', async () => {
      sandbox.on(kcClient, 'createPosition', () => false);
      try {
        await positionAPI.createPosition({}, createPosition);
        expect.fail('should throw Error');
      } catch (e: any) {
        expect(e.message).to.equal('Failed to find group in Keycloak');
      }
      expect(kcClient.createPosition).to.have.been.called.once.with(id);
    });
  });

  describe('[updatePosition]', () => {
    const id = 'dsek.infu.dwww.medlem';
    const updatePosition = {
      name: 'updated',
    };

    it('throws an error if id is missing', async () => {
      await insertPositions();
      const positionId = 'dsek.missing';
      try {
        await positionAPI.updatePosition({}, positionId, updatePosition);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates position', async () => {
      await insertPositions();
      const res = await positionAPI.updatePosition({}, id, updatePosition);
      expect(res).to.deep.equal(convertPosition({ ...positions[0], ...updatePosition }, false));
    });
  });

  describe('[removePosition]', () => {
    it('throws an error if id is missing', async () => {
      await insertPositions();
      const id = 'dsek.missing';
      try {
        await positionAPI.removePosition({}, id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes position', async () => {
      await insertPositions();
      const position = positions[0];
      const res = await positionAPI.removePosition({}, position.id);
      expect(res).to.deep.equal(convertPosition(position, false));
    });
  });
});
