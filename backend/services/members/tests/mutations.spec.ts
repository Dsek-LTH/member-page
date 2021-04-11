import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { DataSources } from '../src/datasources';
import { constructTestServer } from './util';
import { DbMember } from '../src/types/mysql';
import { Member } from '../src/types/graphql';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const CREATE_MEMBER = gql`
mutation createMember {
  member {
    create(input: {student_id: "la6547tr-s", first_name: "Gubbe2", last_name: "25", nickname: "Ful", class_programme: "C", class_year: 2200, picture_path: "/static/members/pictures/emil.jpg"}) {
      id
      student_id
      first_name
      last_name
      nickname
      class_year
      picture_path
      class_programme
    }
  }
}
`
const UPDATE_MEMBER = gql`
mutation updateMember {
  member {
    update(id: 1, input: {first_name: "Gumma4", last_name: "8439"}) {
      id
      student_id
      first_name
      last_name
      nickname
      class_year
      picture_path
      class_programme
    }
  }
}
`
const REMOVE_MEMBER = gql`
mutation removeMember {
  member {
    remove(id: 1) {
      id
      student_id
      first_name
      last_name
      nickname
      class_year
      picture_path
      class_programme
    }
  }
}
`

const CREATE_POSITION = gql`
mutation createPosition {
  position {
    create(input: {name: "Fotograf", committee_id: 2})
  }
}
`
const UPDATE_POSITION = gql`
mutation updatePosition {
  position {
    update(id: 1, input: {name: "Fotograf", committee_id: 2})
  }
}
`
const REMOVE_POSITION = gql`
mutation removePosition {
  position {
    remove(id: 1)
  }
}
`
const CREATE_COMMITTEE = gql`
mutation createCommittee {
  committee {
    create(input: {name: "Informationsutskottet"})
  }
}
`
const UPDATE_COMMITTEE = gql`
mutation updateCommittee {
  committee {
    update(id: 1, input: {name: "Studierådet"})
  }
}
`
const REMOVE_COMMITTEE = gql`
mutation removeCommittee {
  committee {
    remove(id: 1)
  }
}
`

const member: Member = {
  id: 1,
  student_id: "la6547tr-s",
  last_name: "25",
  first_name: "Gubbe",
  nickname: "Ful",
  class_programme: "C",
  class_year: 2200,
  picture_path: "/static/members/pictures/emil.jpg",
}

describe('[Mutations]', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(() => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;

    const c = createTestClient(server);
    client = c;
  })

  beforeEach(() => {
    sandbox.on(dataSources.memberAPI, 'createMember', (input) => new Promise(resolve => resolve(member)))
    sandbox.on(dataSources.memberAPI, 'updateMember', (id, input) => new Promise(resolve => resolve(member)))
    sandbox.on(dataSources.memberAPI, 'removeMember', (id) => new Promise(resolve => resolve(member)))
    sandbox.on(dataSources.positionAPI, 'createPosition', (ctx, input) => new Promise(resolve => resolve(input.name ? true : false)))
    sandbox.on(dataSources.positionAPI, 'updatePosition', (ctx, id, input) => new Promise(resolve => resolve(id ? true : false)))
    sandbox.on(dataSources.positionAPI, 'removePosition', (ctx, id) => new Promise(resolve => resolve(id ? true : false)))
    sandbox.on(dataSources.committeeAPI, 'createCommittee', (ctx, input) => new Promise(resolve => resolve(input.name ? true : false)))
    sandbox.on(dataSources.committeeAPI, 'updateCommittee', (ctx, id, input) => new Promise(resolve => resolve(id ? true : false)))
    sandbox.on(dataSources.committeeAPI, 'removeCommittee', (ctx, id) => new Promise(resolve => resolve(id ? true : false)))
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('[member]', () => {

    it('try creating member no user', async () => {
      const { errors } = await client.mutate({ mutation: CREATE_MEMBER });
      expect(errors).to.exist
    })

    it('creates a member', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { mutate } = createTestClient(server);
      sandbox.on(dataSources.memberAPI, 'createMember', (input) => new Promise(resolve => resolve(member)));
      const { data } = await mutate({ mutation: CREATE_MEMBER });
      expect(data.member.create).to.deep.equal(member);
    })

    it('try updating member no user', async () => {
      const { errors } = await client.mutate({ mutation: UPDATE_MEMBER });
      expect(errors).to.exist
    })

    it('updates a member', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { mutate } = createTestClient(server);
      sandbox.on(dataSources.memberAPI, 'updateMember', (input) => new Promise(resolve => resolve(member)));
      const { data } = await mutate({ mutation: UPDATE_MEMBER });
      expect(data.member.update).to.deep.equal(member);
    })

    it('try removing member no user', async () => {
      const { errors } = await client.mutate({ mutation: REMOVE_MEMBER });
      expect(errors).to.exist
    })

    it('removes a member', async () => {
      const { server, dataSources } = constructTestServer({user: {keycloak_id: 'kc_1'}});
      const { mutate } = createTestClient(server);
      sandbox.on(dataSources.memberAPI, 'removeMember', (input) => new Promise(resolve => resolve(member)));
      const { data } = await mutate({ mutation: REMOVE_MEMBER });
      expect(data.member.remove).to.deep.equal(member);
    })
  })

  describe('[position]', () => {

    it('creates a position', async () => {
      const { data } = await client.mutate({ mutation: CREATE_POSITION });
      expect(data.position.create).to.be.true;
    })

    it('updates a position', async () => {
      const { data } = await client.mutate({ mutation: UPDATE_POSITION });
      expect(data.position.update).to.be.true;
    })

    it('removes a position', async () => {
      const { data } = await client.mutate({ mutation: REMOVE_POSITION });
      expect(data.position.remove).to.be.true;
    })
  })

  describe('[committee]', () => {

    it('creates a committee', async () => {
      const { data } = await client.mutate({ mutation: CREATE_COMMITTEE });
      expect(data.committee.create).to.be.true;
    })

    it('updates a committee', async () => {
      const { data } = await client.mutate({ mutation: UPDATE_COMMITTEE });
      expect(data.committee.update).to.be.true;
    })

    it('removes a committee', async () => {
      const { data } = await client.mutate({ mutation: REMOVE_COMMITTEE });
      expect(data.committee.remove).to.be.true;
    })
  })
})