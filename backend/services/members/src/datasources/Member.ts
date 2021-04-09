import { UserInputError } from 'apollo-server';
import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';


export default class MemberAPI extends dbUtils.KnexDataSource {

  getMembers(filter?: gql.MemberFilter): Promise<gql.Member[]> {
    return this.knex<sql.DbMember>('members').select('*').where(filter || {});
  }

  getMemberFromKeycloakId(keycloak_id: string): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members')
      .select('members.*')
      .join('keycloak', {'members.id': 'keycloak.member_id'})
      .where({keycloak_id: keycloak_id})
      .first());
  }

  getMember(identifier: {student_id?: string, id?: number}): Promise<gql.Maybe<gql.Member>> {
    return dbUtils.unique(this.knex<sql.DbMember>('members').select('*').where(identifier));
  }

  async createMember(studentId: string, firstName: string, lastName: string, classProgramme: string, classYear: number, nickname?: string, picturePath?: string): Promise<gql.Maybe<gql.Member>> {
    const newMember = {
      student_id: studentId,
      first_name: firstName,
      nickname: nickname,
      last_name: lastName,
      class_programme: classProgramme,
      class_year: classYear,
      picture_path: picturePath,
    };
    const id = (await this.knex<sql.DbMember>('members').insert(newMember))[0];
    const member = { id, ...newMember, }
    return member;
  }

  async updateMember(id: number, firstName?: string, lastName?: string, classProgramme?: string, classYear?: number, nickname?: string, picturePath?: string): Promise<gql.Maybe<gql.Member>> {
    const updatedMember = {
      first_name: firstName,
      nickname: nickname,
      last_name: lastName,
      class_programme: classProgramme,
      class_year: classYear,
      picture_path: picturePath,
    };
    await this.knex('members').where({id}).update(updatedMember);
    const member = await dbUtils.unique(this.knex<sql.DbMember>('members').where({id}));
    if (!member) throw new UserInputError('id did not exist');
    return member;
  }

  async removeMember(id: number): Promise<gql.Maybe<gql.Member>> {
    const member = await dbUtils.unique(this.knex<sql.DbMember>('members').where({id}));
    if (!member) throw new UserInputError('id did not exist');
    await this.knex<sql.DbMember>('members').where({id}).del();
    return member;
  }
}