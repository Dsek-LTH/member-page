import { ApolloError, UserInputError } from 'apollo-server';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import 'mocha';

import { DataSources } from '~/src/datasources';
import MemberAPI from '~/src/datasources/Member';
import NotificationsAPI from '~/src/datasources/Notifications';
import { context, knex } from '~/src/shared';
import * as sql from '~/src/types/database';
import * as gql from '~/src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createMembers: sql.CreateMember[] = [
  { student_id: 'test', first_name: 'Truls' },
  { student_id: 'test2', first_name: 'Trula', nickname: 'Woohoo' },
  { student_id: 'test3', first_name: 'Trule', nickname: 'Trule' },
];

const createMember: gql.CreateMember = {
  student_id: 'test4',
  first_name: 'Truls',
  nickname: 'Trule',
  last_name: 'Trulsson',
  class_programme: 'D',
  class_year: 2203,
};

const updateMember: gql.UpdateMember = {
  first_name: 'Trula',
  nickname: 'Trul',
  last_name: 'Trulsson',
  class_programme: 'C',
  class_year: 2233,
  picture_path: 'static/image.jpeg',
};

let members: sql.Member[] = [];

const insertMembers = async () => {
  members = await knex('members').insert(createMembers).returning('*');
};

const memberAPI = new MemberAPI(knex);
const notificationsAPI = new NotificationsAPI(knex);
const datasources = { memberAPI, notificationsAPI };
const mockContext: context.UserContext = { user: { keycloak_id: '', student_id: createMembers[0].student_id } };

describe('[MemberAPI]', () => {
  beforeEach(() => {
    sandbox.on(memberAPI, 'withAccess', (name, _, fn) => fn());
    sandbox.on(notificationsAPI, 'withAccess', (name, _, fn) => fn());
    sandbox.on(notificationsAPI, 'addDefaultSettings', async () => {});
  });

  afterEach(async () => {
    sandbox.restore();
    await knex('members').del();
  });

  describe('[getMember]', () => {
    it('returns the signed in user', async () => {
      await insertMembers();
      const res = await memberAPI.getMember({}, { student_id: members[0].student_id });
      expect(res).to.deep.equal(members[0]);
    });
  });

  describe('[getMembers]', () => {
    const page = 0;
    const perPage = 10;
    const info = {
      totalPages: 1,
      page,
      perPage,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    it('returns all members', async () => {
      await insertMembers();
      const res = await memberAPI.getMembers(mockContext, page, perPage);
      const expected = {
        members,
        pageInfo: {
          totalItems: createMembers.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(expected);
    });

    it('hides nickname if not signed in', async () => {
      await insertMembers();
      const res = await memberAPI.getMembers({}, page, perPage);
      const exptected = {
        members: [...members.map((m) => ({ ...m, nickname: null }))],
        pageInfo: {
          totalItems: createMembers.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(exptected);
    });

    it('returns filtered members', async () => {
      await insertMembers();
      const filter = { id: members[0].id };
      const filtered = [members[0]];
      const res = await memberAPI.getMembers(mockContext, page, perPage, filter);
      const expected = {
        members: filtered,
        pageInfo: {
          totalItems: filtered.length,
          ...info,
        },
      };
      expect(res).to.deep.equal(expected);
    });
  });

  describe('[createMember]', () => {
    it('creates a member', async () => {
      const res = await memberAPI.createMember({ user: { keycloak_id: '123-abc', student_id: createMember.student_id } }, createMember, datasources as unknown as DataSources);
      expect(res).to.deep.equal({
        id: res?.id, ...createMember, picture_path: null, visible: true,
      });
      expect(notificationsAPI.addDefaultSettings).to.have.been.called();
    });
  });

  describe('[updateMember]', () => {
    it('throws an error if id is missing', async () => {
      try {
        await memberAPI.updateMember({}, '277af107-7363-49c7-82aa-426449e18206', updateMember);
        expect.fail('Did not throw Error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('updates member', async () => {
      await insertMembers();
      const res = await memberAPI.updateMember(mockContext, members[0].id, updateMember);
      expect(res).to.deep.equal({ ...members[0], ...updateMember });
    });
  });

  describe('[removeMember]', () => {
    it('throws an error if id is missing', async () => {
      await insertMembers();
      try {
        await memberAPI.removeMember({}, '277af107-7363-49c7-82aa-426449e18206');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });

    it('removes and returns an member', async () => {
      await insertMembers();
      const member = members[0];
      const res = await memberAPI.removeMember({}, member.id);
      expect(res).to.deep.equal(member);
    });
  });

  const WAIT_1_MS = async () => new Promise((resolve) => { setTimeout(resolve, 1); });
  describe('[getPings]', () => {
    beforeEach(async () => {
      await insertMembers();
    });
    afterEach(async () => {
      await knex('pings').del();
    });
    it('returns empty when no pings', async () => {
      const res = await memberAPI.getPings(mockContext);
      expect(res).to.deep.equal([]);
    });
    it('returns empty when only I pinged', async () => {
      await knex('pings').insert({ from_member: members[0].id, to_member: members[1].id });
      const res = await memberAPI.getPings(mockContext);
      expect(res).to.deep.equal([]);
    });
    it('returns empty when I pinged multiple people', async () => {
      await knex('pings').insert({ from_member: members[0].id, to_member: members[1].id });
      await knex('pings').insert({ from_member: members[0].id, to_member: members[2].id });
      const res = await memberAPI.getPings(mockContext);
      expect(res).to.deep.equal([]);
    });
    it('returns empty when I pinged back', async () => {
      const pingId = (await knex('pings').insert({ from_member: members[1].id, to_member: members[0].id }).returning('id'))[0].id;
      await WAIT_1_MS();
      await knex('pings').where({ id: pingId }).update({ count: 2, to_sent_at: new Date() });
      const res = await memberAPI.getPings(mockContext);
      expect(res).to.deep.equal([]);
    });
    it('returns a ping when they pinged me first', async () => {
      const before = new Date();
      await knex('pings').insert({ from_member: members[1].id, to_member: members[0].id });
      const res = await memberAPI.getPings(mockContext);
      expect(res.length).to.equal(1);
      expect(res[0].counter).to.equal(1);
      expect(res[0].from).to.deep.equal(members[1]);
      expect(res[0].lastPing).to.be.at.least(before);
      expect(res[0].lastPing).to.be.at.most(new Date());
    });
    it('returns a ping when I pinged them first', async () => {
      const pingId = (await knex('pings').insert({ from_member: members[0].id, to_member: members[1].id }).returning('id'))[0].id;
      await WAIT_1_MS();
      await knex('pings').where({ id: pingId }).update({ count: 2, to_sent_at: new Date() });
      const res = await memberAPI.getPings(mockContext);
      expect(res.length).to.equal(1);
      expect(res[0].counter).to.equal(1);
      expect(res[0].from).to.deep.equal(members[1]);
    });
    it('returns a single ping on consecutive pings', async () => {
      const pingId = (await knex('pings').insert({ from_member: members[1].id, to_member: members[0].id }).returning('id'))[0].id;
      await WAIT_1_MS();
      await knex('pings').where({ id: pingId }).update({ count: 2, to_sent_at: new Date() });
      await WAIT_1_MS();
      const before = new Date();
      await knex('pings').where({ id: pingId }).update({ count: 3, from_sent_at: new Date() });
      await WAIT_1_MS();
      const res = await memberAPI.getPings(mockContext);
      expect(res.length).to.equal(1);
      expect(res[0].counter).to.equal(2);
      expect(res[0].from).to.deep.equal(members[1]);
      expect(res[0].lastPing).to.be.at.least(before);
      expect(res[0].lastPing).to.be.at.most(new Date());
    });
    it('returns multiple pings from multiple people', async () => {
      const before = new Date();
      await knex('pings').insert({ from_member: members[1].id, to_member: members[0].id });
      await knex('pings').insert({ from_member: members[2].id, to_member: members[0].id });
      await WAIT_1_MS();
      const res = await memberAPI.getPings(mockContext);
      expect(res.length).to.equal(2);
      expect(res[0].counter).to.equal(1);
      expect(res[1].counter).to.equal(1);
      expect(res[0].from).to.deep.equal(members[2]); // we want latest first
      expect(res[1].from).to.deep.equal(members[1]);
      expect(res[0].lastPing).to.be.at.least(before);
      expect(res[1].lastPing).to.be.at.least(before);
      expect(res[0].lastPing).to.be.at.most(new Date());
      expect(res[1].lastPing).to.be.at.most(new Date());
    });
    it('returns multiple pings from the multiple people', async () => {
      const ping1Id = (await knex('pings').insert({ from_member: members[1].id, to_member: members[0].id }).returning('id'))[0].id; // p1 -> me
      await WAIT_1_MS();
      await knex('pings').where({ id: ping1Id }).update({ count: 2, to_sent_at: new Date() }); // me -> p1
      await WAIT_1_MS();
      const ping2Id = (await knex('pings').insert({ from_member: members[2].id, to_member: members[0].id }).returning('id'))[0].id; // p2 -> me
      await WAIT_1_MS();
      await knex('pings').where({ id: ping2Id }).update({ count: 2, to_sent_at: new Date() }); // me -> p2
      await WAIT_1_MS();
      await knex('pings').where({ id: ping2Id }).update({ count: 3, from_sent_at: new Date() }); // p2-> me
      await WAIT_1_MS();
      const before1 = new Date();
      await knex('pings').where({ id: ping1Id }).update({ count: 3, from_sent_at: new Date() }); // p1 -> me
      await WAIT_1_MS();
      await knex('pings').where({ id: ping2Id }).update({ count: 4, to_sent_at: new Date() }); // me-> p2
      await WAIT_1_MS();
      const before2 = new Date();
      await knex('pings').where({ id: ping2Id }).update({ count: 5, from_sent_at: new Date() }); // me-> p2
      await WAIT_1_MS();
      const res = await memberAPI.getPings(mockContext);
      expect(res.length).to.equal(2);
      expect(res[0].counter).to.equal(3);
      expect(res[1].counter).to.equal(2);
      expect(res[0].from).to.deep.equal(members[2]);
      expect(res[1].from).to.deep.equal(members[1]);
      expect(res[0].lastPing).to.be.at.least(before2);
      expect(res[1].lastPing).to.be.at.least(before1);
      expect(res[0].lastPing).to.be.at.most(new Date());
      expect(res[1].lastPing).to.be.at.most(new Date());
    });
  });
  describe('[pingMember]', () => {
    beforeEach(async () => {
      await insertMembers();
    });
    afterEach(async () => {
      await knex('members').del();
      await knex('pings').del();
    });
    const otherMockContext: context.UserContext = { user: { keycloak_id: '', student_id: createMembers[1].student_id } };
    it('throws an error when not logged in', async () => {
      try {
        await memberAPI.pingMember({}, members[1].id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(ApolloError);
      }
    });
    it('throws an error when member does not exist', async () => {
      try {
        await memberAPI.pingMember(mockContext, '01fff483-758a-4495-969e-f6de414d5a43');
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });
    it('pings a member', async () => {
      await memberAPI.pingMember(mockContext, members[1].id);
      const res = await memberAPI.getPings(otherMockContext);
      expect(res.length).to.equal(1);
      expect(res[0].counter).to.equal(1);
      expect(res[0].from).to.deep.equal(members[0]);
    });
    it('pings a member multiple times', async () => {
      await memberAPI.pingMember(mockContext, members[1].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(otherMockContext, members[0].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(mockContext, members[1].id);
      const myPings = await memberAPI.getPings(mockContext);
      const theirPings = await memberAPI.getPings(otherMockContext);
      expect(myPings.length).to.equal(0);
      expect(theirPings.length).to.equal(1);
      expect(theirPings[0].counter).to.equal(2);
      expect(theirPings[0].from).to.deep.equal(members[0]);
    });
    it('pings multiple people', async () => {
      await memberAPI.pingMember(mockContext, members[1].id);
      await memberAPI.pingMember(mockContext, members[2].id);
      const pings1 = await memberAPI.getPings(otherMockContext);
      const pings2 = await memberAPI.getPings({ user: { keycloak_id: '', student_id: createMembers[2].student_id } });
      expect(pings1.length).to.equal(1);
      expect(pings1[0].counter).to.equal(1);
      expect(pings1[0].from).to.deep.equal(members[0]);
      expect(pings2.length).to.equal(1);
      expect(pings2[0].counter).to.equal(1);
      expect(pings2[0].from).to.deep.equal(members[0]);
    });
    it('pings multiple people multiple times', async () => {
      const thirdUserMockContext = { user: { keycloak_id: '', student_id: createMembers[2].student_id } };
      await memberAPI.pingMember(mockContext, members[1].id);
      await memberAPI.pingMember(mockContext, members[2].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(otherMockContext, members[0].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(mockContext, members[1].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(thirdUserMockContext, members[0].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(mockContext, members[2].id);
      const pingsMine = await memberAPI.getPings(mockContext);
      const pings1 = await memberAPI.getPings(otherMockContext);
      const pings2 = await memberAPI.getPings(thirdUserMockContext);
      expect(pingsMine.length).to.equal(0);
      expect(pings1.length).to.equal(1);
      expect(pings1[0].counter).to.equal(2);
      expect(pings1[0].from).to.deep.equal(members[0]);
      expect(pings2.length).to.equal(1);
      expect(pings2[0].counter).to.equal(2);
      expect(pings2[0].from).to.deep.equal(members[0]);
    });
    it('pings same person by multiple people', async () => {
      const thirdUserMockContext = { user: { keycloak_id: '', student_id: createMembers[2].student_id } };
      await memberAPI.pingMember(mockContext, members[1].id);
      await memberAPI.pingMember(mockContext, members[2].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(otherMockContext, members[0].id);
      await WAIT_1_MS();
      await memberAPI.pingMember(thirdUserMockContext, members[0].id);
      const pingsMine = await memberAPI.getPings(mockContext);
      const pings1 = await memberAPI.getPings(otherMockContext);
      const pings2 = await memberAPI.getPings(thirdUserMockContext);
      expect(pingsMine.length).to.equal(2);
      expect(pingsMine[0].counter).to.equal(1);
      expect(pingsMine[1].counter).to.equal(1);
      expect(pingsMine[0].from).to.deep.equal(members[2]);
      expect(pingsMine[1].from).to.deep.equal(members[1]);
      expect(pings1.length).to.equal(0);
      expect(pings2.length).to.equal(0);
    });
    it('throws an error if I pinged last', async () => {
      await memberAPI.pingMember(mockContext, members[1].id);
      try {
        await memberAPI.pingMember(mockContext, members[1].id);
        expect.fail('did not throw error');
      } catch (e) {
        expect(e).to.be.instanceof(UserInputError);
      }
    });
  });
});
