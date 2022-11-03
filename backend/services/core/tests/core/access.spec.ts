import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { ApiAccessPolicy, knex } from '~/src/shared';
import AccessAPI from '~/src/datasources/Access';
import {
  Door, CreateDoorAccessPolicy, DoorAccessPolicy, CreateMember, Member, CreatePosition, Mandate,
} from '~/src/types/database';
import { Position } from '~/src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const accessAPI = new AccessAPI(knex);

let members: Member[] = [];
let positions: Position[] = [];
let mandates: Mandate[] = [];
let doors: Door[] = [];
let doorAccessPolicies: DoorAccessPolicy[] = [];
let apiAccessPolicies: ApiAccessPolicy[] = [];

const createMembers: CreateMember[] = [
  { student_id: 'aa0001bb-s' },
  { student_id: 'aa0002bb-s' },
];

const createPositions: CreatePosition[] = [
  { id: 'dsek.mdlm', name: 'Medlem' },
  { id: 'dsek.styr', name: 'Styr' },
];

const createDoors: Door[] = [
  { name: 'Door 1' },
  { name: 'Door 2', id: 'E:1234' },
];

const createDoorAccessPolicies: CreateDoorAccessPolicy[] = [
  { door_name: 'Door 1', role: 'dsek' },
  { door_name: 'Door 1', student_id: 'aa0003bb-s' },
];

const yesterday = new Date(Date.now() - (1440 + new Date().getTimezoneOffset()) * 60 * 1000);
const tomorrow = new Date(Date.now() + (1440 - new Date().getTimezoneOffset()) * 60 * 1000);

const insertAccessPolicies = async () => {
  members = await knex('members').insert(createMembers).returning('*');
  positions = await knex('positions').insert(createPositions).returning('*');
  mandates = await knex('mandates').insert([
    {
      member_id: members[0].id,
      position_id: positions[0].id,
      start_date: yesterday,
      end_date: tomorrow,
    },
    {
      member_id: members[1].id,
      position_id: positions[1].id,
      start_date: yesterday,
      end_date: tomorrow,
    },
  ]).returning('*');
  doors = await knex('doors').insert(createDoors).returning('*');
  doorAccessPolicies = await knex('door_access_policies').insert(createDoorAccessPolicies).returning('*');
  apiAccessPolicies = await knex('api_access_policies').insert([
    { api_name: 'api:read', role: 'dsek' },
    { api_name: 'api:read', student_id: 'aa0001bb-s' },
    { api_name: 'api:update', student_id: 'aa0001bb-s' },
    { api_name: 'api:create', student_id: 'aa0004bb-s' },
  ]).returning('*');
};

describe('[AccessAPI]', () => {
  beforeEach(() => {
    sandbox.on(accessAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    await knex('api_access_policies').del();
    await knex('door_access_policies').del();
    await knex('doors').del();
    await knex('mandates').del();
    await knex('positions').del();
    await knex('members').del();
    sandbox.restore();
  });

  describe('[getDoors]', () => {
    it('returns all doors', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.getDoors({});
      expect(res).to.deep.equal(doors);
    });
  });

  describe('[getDoor]', () => {
    it('returns a door', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.getDoor({}, doors[0].name);
      expect(res?.name).to.equal(doors[0].name);
      expect(res?.accessPolicies?.map((ap) => ap.accessor).sort()).to.deep.equal(['dsek', 'aa0003bb-s'].sort());
      expect(res?.studentIds?.sort()).to.deep.equal(['aa0001bb-s', 'aa0002bb-s', 'aa0003bb-s']);
    });

    it('returns undefined if door not found', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.getDoor({}, 'Missing Door');
      expect(res).to.be('undefined');
    });

    it('ignores inactive access policies for studentIds', async () => {
      await insertAccessPolicies();
      await knex('door_access_policies').insert([{
        door_name: 'Door 1', student_id: 'aa0004bb-s', start_datetime: yesterday, end_datetime: new Date(Date.now() - 1000),
      }, {
        door_name: 'Door 1', student_id: 'aa0005bb-s', start_datetime: new Date(Date.now() + 1000), end_datetime: tomorrow,
      }]);

      const res = await accessAPI.getDoor({}, doors[0].name);
      expect(res?.studentIds).to.not.include('aa0004bb-s');
      expect(res?.studentIds).to.not.include('aa0005bb-s');
    });

    it('ignores inactive mandates for studentIds', async () => {
      await insertAccessPolicies();
      await knex('mandates').where({ id: mandates[0].id }).update({ end_date: yesterday });
      await knex('mandates').where({ id: mandates[1].id }).update({ start_date: tomorrow });

      const res = await accessAPI.getDoor({}, doors[0].name);
      expect(res?.studentIds).to.not.include('aa0001bb-s');
      expect(res?.studentIds).to.not.include('aa0002bb-s');
    });
  });

  describe('[createDoor]', () => {
    it('creates a door', async () => {
      const res = await accessAPI.createDoor({}, { name: 'Door 3', id: 'E:1234' });
      expect(res?.name).to.equal('Door 3');
      expect(res?.id).to.equal('E:1234');
      expect(res?.accessPolicies).to.be('undefined');
      expect(res?.studentIds).to.be('undefined');
    });
  });

  describe('[removeDoor]', () => {
    it('returns undefined if missing', async () => {
      await insertAccessPolicies();
      const door = await accessAPI.removeDoor({}, 'Missing Door');
      expect(door).to.be('undefined');
    });

    it('removes a door', async () => {
      await insertAccessPolicies();
      const door = await accessAPI.removeDoor({}, doors[0].name);
      const res = accessAPI.getDoor({}, doors[0].name);
      expect(door).to.deep.equal(doors[0]);
      expect(res).to.be.empty;
    });
  });

  describe('[getApi]', () => {
    it('returns undefined if missing', async () => {
      await insertAccessPolicies();
      const door = await accessAPI.getApi({}, 'missing:read');
      expect(door).to.be('undefined');
    });

    it('returns a api with policies', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.getApi({}, 'api:read');
      expect(res?.name).to.equal('api:read');
      expect(res?.accessPolicies?.map((ap) => ap.accessor)).to.deep.equal(['dsek', 'aa0001bb-s']);
    });
  });

  describe('[getApis]', () => {
    it('returns all apis', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.getApis({});
      expect(res.map((api) => api.name)).to.deep.equal(['api:create', 'api:read', 'api:update']);
      expect(res[0].accessPolicies?.map((ap) => ap.accessor)).to.deep.equal(['aa0004bb-s']);
      expect(res[1].accessPolicies?.map((ap) => ap.accessor)).to.deep.equal(['dsek', 'aa0001bb-s']);
      expect(res[2].accessPolicies?.map((ap) => ap.accessor)).to.deep.equal(['aa0001bb-s']);
    });
  });

  describe('[getUserApis]', () => {
    it('returns all apis the user has access to', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.getUserApis({ user: { student_id: 'aa0001bb-s', keycloak_id: '' }, roles: ['dsek'] });
      expect(res).to.deep.equal([{ name: 'api:read' }, { name: 'api:update' }]);
    });
  });

  describe('[createDoorAccessPolicy]', () => {
    it('creates a door access policy', async () => {
      await knex('doors').insert({ name: 'Door 1' });
      const res = await accessAPI.createDoorAccessPolicy({}, { doorName: 'Door 1', who: 'dsek' });
      expect(res?.accessor).to.equal('dsek');
      expect(res?.start_datetime).to.be('undefined');
      expect(res?.end_datetime).to.be('undefined');
    });

    it('creates a door access policy with start and end dates', async () => {
      await knex('doors').insert({ name: 'Door 1' });
      const res = await accessAPI.createDoorAccessPolicy({}, {
        doorName: 'Door 1', who: 'dsek', startDatetime: '2020-01-01T12:00:00Z', endDatetime: '2020-01-01T18:00:00Z',
      });
      expect(res?.start_datetime).to.deep.equal(new Date('2020-01-01T12:00:00Z'));
      expect(res?.end_datetime).to.deep.equal(new Date('2020-01-01T18:00:00Z'));
    });
  });

  describe('[createApiAccessPolicy]', () => {
    it('creates an api access policy', async () => {
      const res = await accessAPI.createApiAccessPolicy({}, { apiName: 'api2:read', who: 'aa1234bb-s' });
      expect(res?.accessor).to.equal('aa1234bb-s');
    });
  });

  describe('[removeAccessPolicy]', () => {
    it('returns undefined if missing', async () => {
      await insertAccessPolicies();
      const door = await accessAPI.removeAccessPolicy({}, 'dd6568b9-d7ba-4e43-884a-9375320265d3');
      expect(door).to.be('undefined');
    });

    it('removes a door access policy', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.removeAccessPolicy({}, doorAccessPolicies[0].id);
      const door = await accessAPI.getDoor({}, doors[0].name);
      expect(res?.accessor).to.deep.equal(doorAccessPolicies[0].role);
      expect(door?.accessPolicies?.map((p) => p.id)).to.not.include(res?.id);
    });

    it('removes an api access policy', async () => {
      await insertAccessPolicies();
      const res = await accessAPI.removeAccessPolicy({}, apiAccessPolicies[0].id);
      const api = await accessAPI.getApi({}, 'api:read');
      expect(res?.accessor).to.deep.equal(apiAccessPolicies[0].role);
      expect(api?.accessPolicies?.map((p) => p.id)).to.not.include(res?.id);
    });
  });
});
