import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { UserInputError } from 'apollo-server';
import { knex, UUID } from '~/src/shared';
import * as sql from '~/src/types/database';
import MandateAPI from '~/src/datasources/Mandate';
import {
  CreateMandate, UpdateMandate,
} from '~/src/types/graphql';
import kcClient from '~/src/keycloak';
import { convertMandate } from '~/src/shared/converters';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const positions: sql.Position[] = [
  {
    id: 'dsek.infu.dwww.medlem',
    name: 'DWWW-medlem',
    name_en: 'DWWW member',
    description: '',
    description_en: '',
    committee_id: null,
    active: true,
    board_member: false,
    email: null,
  },
  {
    id: 'dsek.km.mastare',
    name: 'Källarmästare',
    name_en: 'Head of Facilities',
    description: '',
    description_en: '',
    committee_id: null,
    active: true,
    board_member: false,
    email: 'kallarm@dsek.se',
  },
];

const createMembers: sql.CreateMember[] = [
  { student_id: 'ab1234cd-s' },
  { student_id: 'ab4321cd-s' },
];

let members: sql.Member[] = [];
let keycloak: sql.Keycloak[] = [];
let mandates: sql.Mandate[] = [];

const yesterday = new Date(Date.now() - (1440 + new Date().getTimezoneOffset()) * 60 * 1000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + (1440 - new Date().getTimezoneOffset()) * 60 * 1000).toISOString().split('T')[0];

const mandateAPI = new MandateAPI(knex);

const insertMandates = async () => {
  members = await knex('members').insert(createMembers).returning('*');

  const keycloakIds: sql.Keycloak[] = [
    { keycloak_id: '1234-asdf-2134-asdf', member_id: members[0].id },
    { keycloak_id: '1234-asdf-4321-asdf', member_id: members[1].id },
  ];

  const createMandates: sql.CreateMandate[] = [
    {
      start_date: '2021-02-01', end_date: '2021-02-11', position_id: 'dsek.infu.dwww.medlem', member_id: members[0].id,
    },
    {
      start_date: '2021-01-01', end_date: '2021-12-31', position_id: 'dsek.infu.dwww.medlem', member_id: members[1].id,
    },
    {
      start_date: '2021-03-01', end_date: '2022-01-01', position_id: 'dsek.km.mastare', member_id: members[1].id,
    },
  ];

  keycloak = await knex('keycloak').insert(keycloakIds).returning('*');
  await knex('positions').insert(positions);
  mandates = await knex('mandates').insert(createMandates).returning('*');
};

describe('[MandateAPI]', () => {
  beforeEach(() => {
    sandbox.on(kcClient, 'deleteMandate', () => { });
    sandbox.on(kcClient, 'createMandate', () => { });
    sandbox.on(mandateAPI, 'withAccess', (_, __, fn) => fn());
  });

  afterEach(async () => {
    await knex('mandates').del();
    await knex('positions').del();
    await knex('keycloak').del();
    await knex('members').del();
    sandbox.restore();
  });

  describe('[getMandate]', () => {
    it('returns a mandate', async () => {
      await insertMandates();
      const mandate = await mandateAPI.getMandate({}, mandates[0].id);
      const expected = convertMandate(mandates[0]);
      expect(mandate).to.deep.equal(expected);
    });

    it('returns undefined if mandate is missing', async () => {
      await insertMandates();
      const mandate = await mandateAPI.getMandate({}, '96143b69-d98a-4772-a28f-e3ad51128804');
      expect(mandate).to.be.undefined;
    });
  });

  describe('[getMandatesForMember]', () => {
    it('returns all mandates for a member', async () => {
      await insertMandates();
      const res = await mandateAPI.getMandatesForMember({}, members[1].id, false);
      expect(res).to.deep.equal(
        mandates.filter((m) => m.member_id === members[1].id).map(convertMandate),
      );
    });

    it('returns only active mandates for a member', async () => {
      await insertMandates();
      const activeMandate = [{
        id: 'dba804e8-8124-11ec-a8a3-0242ac120002',
        start_date: new Date(yesterday),
        end_date: new Date(tomorrow),
        position_id: 'dsek.km.mastare',
        member_id: members[0].id,
        in_keycloak: false,
      }];
      await knex('mandates').insert(activeMandate).returning('*');
      const res = await mandateAPI.getMandatesForMember({}, members[0].id, true);
      expect(res).to.deep.equal(activeMandate.map(convertMandate));
    });
  });

  describe('[createMandate]', () => {
    const partialMandate: Omit<CreateMandate, 'member_id'> = {
      position_id: 'dsek.infu.dwww.medlem',
      start_date: '2020-01-01',
      end_date: '2020-12-31',
    };

    let createMandate: CreateMandate;

    beforeEach(async () => {
      await insertMandates();
      createMandate = { ...partialMandate, member_id: members[0].id };
    });

    it('creates a mandate and returns it', async () => {
      const res = await mandateAPI.createMandate({
        user: {
          keycloak_id: keycloak[0].keycloak_id,
        },
      }, createMandate);
      const expected = {
        id: res?.id as UUID,
        ...createMandate,
        start_date: new Date(createMandate.start_date),
        end_date: new Date(createMandate.end_date),
        in_keycloak: false,
      };
      expect(res).to.deep.equal(convertMandate(expected));
    });

    it('updates keycloak if mandate is active', async () => {
      const createMandate2 = { ...createMandate, start_date: yesterday, end_date: tomorrow };

      await mandateAPI.createMandate({
        user: {
          keycloak_id: keycloak[0].keycloak_id,
        },
      }, createMandate2);
      expect(kcClient.createMandate).to.have.been.called.once.with('dsek.infu.dwww.medlem').and.with('1234-asdf-2134-asdf');
    });

    it('does not update keycloak if mandate is not active', async () => {
      await mandateAPI.createMandate({
        user: {
          keycloak_id: keycloak[0].keycloak_id,
        },
      }, createMandate);
      expect(kcClient.createMandate).to.not.have.been.called();
    });
  });

  describe('[updateMandate]', () => {
    const partialMandate: Partial<UpdateMandate> = {
      position_id: 'dsek.km.mastare',
      start_date: new Date('2020-01-01 10:00:00'),
      end_date: new Date('2020-12-31 10:00:00'),
    };

    let updateMandate: UpdateMandate;

    beforeEach(async () => {
      await insertMandates();
      updateMandate = { ...partialMandate, member_id: members[0].id };
    });

    it('throws an error if id is missing', async () => {
      try {
        await mandateAPI.updateMandate({}, '277af107-7363-49c7-82aa-426449e18206', updateMandate);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates and returns a mandate', async () => {
      const expected = convertMandate(
        { id: mandates[0].id, ...updateMandate, in_keycloak: false } as sql.Mandate,
      );
      const res = await mandateAPI.updateMandate({}, mandates[0].id, updateMandate);
      expect(res).to.deep.equal(expected);
    });

    it('creates in keycloak if mandate is active', async () => {
      const updateMandate2 = { ...partialMandate, start_date: yesterday, end_date: tomorrow };
      await mandateAPI.updateMandate({}, mandates[2].id, updateMandate2);
      expect(kcClient.createMandate).to.have.been.called
        .once.with('1234-asdf-4321-asdf')
        .and.with('dsek.km.mastare');
    });

    it('removes from keycloak if mandate is not active', async () => {
      await mandateAPI.updateMandate({}, mandates[2].id, updateMandate);
      expect(kcClient.deleteMandate).to.have.been.called
        .once.with('1234-asdf-2134-asdf')
        .and.with('dsek.km.mastare');
    });
  });

  describe('[removeMandate]', () => {
    it('throws an error if id is missing', async () => {
      try {
        await mandateAPI.removeMandate({}, '277af107-7363-49c7-82aa-426449e18206');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns a mandate', async () => {
      await insertMandates();
      const mandate = mandates[0];

      const res = await mandateAPI.removeMandate({}, mandate.id);
      expect(res).to.deep.equal(convertMandate(mandate));
    });

    it('removes mandate from keycloak', async () => {
      await insertMandates();
      const mandate = mandates[0];

      await mandateAPI.removeMandate({}, mandate.id);
      expect(kcClient.deleteMandate).to.have.been.called.once.with('1234-asdf-2134-asdf').and.with('dsek.infu.dwww.medlem');
    });
  });
});
