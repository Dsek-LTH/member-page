import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';

import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';
import {
  Committee, Mandate, Member, Position,
} from '~/src/types/graphql';

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
`;
const UPDATE_MEMBER = gql`
mutation updateMember {
  member {
    update(id: "c5cdfaa7-c720-4d0e-9e99-07350eab6624", input: {first_name: "Gumma4", last_name: "8439"}) {
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
`;
const REMOVE_MEMBER = gql`
mutation removeMember {
  member {
    remove(id: "c5cdfaa7-c720-4d0e-9e99-07350eab6624") {
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
`;

const CREATE_POSITION = gql`
mutation createPosition {
  position {
    create(input: {name: "Fotograf", id: "dsek.infu.fotograf", committee_id: "c5cdfaa7-c720-4d0e-9e99-07350eab6624"}) {
      id
      name
    }
  }
}
`;
const UPDATE_POSITION = gql`
mutation updatePosition {
  position {
    update(id: "dsek.infu.fotograf", input: {name: "Fotograf2", committee_id: "c5cdfaa7-c720-4d0e-9e99-07350eab6624"}) {
      id
      name
    }
  }
}
`;
const REMOVE_POSITION = gql`
mutation removePosition {
  position {
    remove(id: "dsek.infu.fotograf") {
      id
      name
    }
  }
}
`;
const CREATE_COMMITTEE = gql`
mutation createCommittee {
  committee {
    create(input: {name: "Informationsutskottet"}) {
      id
      name
    }
  }
}
`;
const UPDATE_COMMITTEE = gql`
mutation updateCommittee {
  committee {
    update(id: 1, input: {name: "Studierådet"}) {
      id
      name
    }
  }
}
`;
const REMOVE_COMMITTEE = gql`
mutation removeCommittee {
  committee {
    remove(id: 1) {
      id
      name
    }
  }
}
`;
const CREATE_MANDATE = gql`
mutation createMandate {
  mandate {
    create(input: {position_id: "dsek.infu.fotograf", member_id: 1, start_date: "2021-01-01 00:00:00", end_date: "2022-01-01 00:00:00"}) {
      id
      start_date
      end_date
    }
  }
}
`;
const UPDATE_MANDATE = gql`
mutation updateMandate {
  mandate {
    update(id: 1, input: {position_id: "dsek.infu.artist"}) {
      id
      start_date
      end_date
    }
  }
}
`;
const REMOVE_MANDATE = gql`
mutation removeMandate {
  mandate {
    remove(id: 1) {
      id
      start_date
      end_date
    }
  }
}
`;

const member: Member = {
  id: '6034f5b1-692d-4d4f-ba34-34d9cab3c821',
  student_id: 'la6547tr-s',
  last_name: '25',
  first_name: 'Gubbe',
  nickname: 'Ful',
  class_programme: 'C',
  class_year: 2200,
  picture_path: '/static/members/pictures/emil.jpg',
};

const mandate: Mandate = {
  id: '6034f5b1-692d-4d4f-ba34-34d9cab3c826',
  start_date: new Date('2021-01-01 00:00:00'),
  end_date: new Date('2022-01-01 00:00:00'),
};

const committee: Committee = {
  id: '6034f5b1-692d-4d4f-ba34-34d9cab3c829',
  name: 'Informationsutskottet',
};

const position: Position = {
  id: 'dsek.infu.dwww.medlem',
  name: 'DWWW-medlem',
};

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
  });

  beforeEach(() => {
    sandbox.on(dataSources.memberAPI, 'createMember', () => Promise.resolve(member));
    sandbox.on(dataSources.memberAPI, 'updateMember', () => Promise.resolve(member));
    sandbox.on(dataSources.memberAPI, 'removeMember', () => Promise.resolve(member));
    sandbox.on(dataSources.positionAPI, 'createPosition', () => Promise.resolve(position));
    sandbox.on(dataSources.positionAPI, 'updatePosition', () => Promise.resolve(position));
    sandbox.on(dataSources.positionAPI, 'removePosition', () => Promise.resolve(position));
    sandbox.on(dataSources.committeeAPI, 'createCommittee', () => Promise.resolve(committee));
    sandbox.on(dataSources.committeeAPI, 'updateCommittee', () => Promise.resolve(committee));
    sandbox.on(dataSources.committeeAPI, 'removeCommittee', () => Promise.resolve(committee));
    sandbox.on(dataSources.mandateAPI, 'createMandate', () => Promise.resolve(mandate));
    sandbox.on(dataSources.mandateAPI, 'updateMandate', () => Promise.resolve(mandate));
    sandbox.on(dataSources.mandateAPI, 'removeMandate', () => Promise.resolve(mandate));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('[member]', () => {
    it('creates a member', async () => {
      const { server: tmpServer, dataSources: tmpDataSources } = constructTestServer({ user: { keycloak_id: 'kc_1' } });
      const { mutate } = createTestClient(tmpServer);
      sandbox.on(tmpDataSources.memberAPI, 'createMember', () => Promise.resolve(member));
      const { data } = await mutate({ mutation: CREATE_MEMBER });
      expect(data.member.create).to.deep.equal(member);
    });

    it('updates a member', async () => {
      const { server: tmpServer, dataSources: tmpDataSources } = constructTestServer({ user: { keycloak_id: 'kc_1' } });
      const { mutate } = createTestClient(tmpServer);
      sandbox.on(tmpDataSources.memberAPI, 'updateMember', () => Promise.resolve(member));
      const { data } = await mutate({ mutation: UPDATE_MEMBER });
      expect(data.member.update).to.deep.equal(member);
    });

    it('removes a member', async () => {
      const { server: tmpServer, dataSources: tmpDataSources } = constructTestServer({ user: { keycloak_id: 'kc_1' } });
      const { mutate } = createTestClient(tmpServer);
      sandbox.on(tmpDataSources.memberAPI, 'removeMember', () => Promise.resolve(member));
      const { data } = await mutate({ mutation: REMOVE_MEMBER });
      expect(data.member.remove).to.deep.equal(member);
    });
  });

  describe('[position]', () => {
    it('creates a position', async () => {
      const { data } = await client.mutate({ mutation: CREATE_POSITION });
      expect(data.position.create).to.deep.equal(position);
    });

    it('updates a position', async () => {
      const { data } = await client.mutate({ mutation: UPDATE_POSITION });
      expect(data.position.update).to.deep.equal(position);
    });

    it('removes a position', async () => {
      const { data } = await client.mutate({ mutation: REMOVE_POSITION });
      expect(data.position.remove).to.deep.equal(position);
    });
  });

  describe('[committee]', () => {
    it('creates a committee', async () => {
      const { data } = await client.mutate({ mutation: CREATE_COMMITTEE });
      expect(dataSources.committeeAPI.createCommittee).to.have.been.called.with({ name: 'Informationsutskottet' });
      expect(data.committee.create).to.deep.equal(committee);
    });

    it('updates a committee', async () => {
      const { data } = await client.mutate({ mutation: UPDATE_COMMITTEE });
      expect(dataSources.committeeAPI.updateCommittee).to.have.been.called.with(1);
      expect(dataSources.committeeAPI.updateCommittee).to.have.been.called.with({ name: 'Studierådet' });
      expect(data.committee.update).to.deep.equal(committee);
    });

    it('removes a committee', async () => {
      const { data } = await client.mutate({ mutation: REMOVE_COMMITTEE });
      expect(dataSources.committeeAPI.removeCommittee).to.have.been.called.with(1);
      expect(data.committee.remove).to.deep.equal(committee);
    });
  });

  describe('[mandate]', () => {
    it('creates a mandate', async () => {
      const { data } = await client.mutate({ mutation: CREATE_MANDATE });
      expect(data.mandate.create).to.deep.equal(mandate);
    });

    it('updates a mandate', async () => {
      const { data } = await client.mutate({ mutation: UPDATE_MANDATE });
      expect(dataSources.mandateAPI.updateMandate).to.have.been.called.with(1);
      expect(dataSources.mandateAPI.updateMandate).to.have.been.called.with({ position_id: 'dsek.infu.artist' });
      expect(data.mandate.update).to.deep.equal(mandate);
    });

    it('removes a mandate', async () => {
      const { data } = await client.mutate({ mutation: REMOVE_MANDATE });
      expect(dataSources.mandateAPI.removeMandate).to.have.been.called.with(1);
      expect(data.mandate.remove).to.deep.equal(mandate);
    });
  });
});
