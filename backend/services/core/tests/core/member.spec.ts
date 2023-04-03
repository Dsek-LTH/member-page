import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { UserInputError } from 'apollo-server';

import { knex } from '~/src/shared';
import MemberAPI from '~/src/datasources/Member';
import * as sql from '~/src/types/database';
import * as gql from '~/src/types/graphql';
import NotificationsAPI from '~/src/datasources/Notifications';
import { DataSources } from '~/src/datasources';

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
const mockContext = { user: { keycloak_id: '' } };

describe('[MemberAPI]', () => {
  beforeEach(() => {
    sandbox.on(memberAPI, 'withAccess', (name, context, fn) => fn());
    sandbox.on(notificationsAPI, 'withAccess', (name, context, fn) => fn());
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
});
