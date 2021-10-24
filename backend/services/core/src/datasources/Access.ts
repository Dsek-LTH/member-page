import { context, dbUtils, UUID, ApiAccessPolicy } from "dsek-shared";
import * as gql from "../types/graphql";
import * as sql from "../types/database";
import { UserInputError } from "apollo-server-errors";

export default class AccessAPI extends dbUtils.KnexDataSource {
  private convertAccess(policy: sql.DoorAccessPolicy | ApiAccessPolicy): gql.AccessPolicy {
    return {
      id: policy.id,
      accessor: policy.role ?? policy.student_id ?? '',
    };
  }

  getDoor = (context: context.UserContext, name: string): Promise<gql.Maybe<gql.Door>> =>
    this.withAccess('core:access:door:read', context, async () => {
      const door = await this.knex<sql.Door>('doors').where({ name }).first();
      if (!door)
        return undefined;

      const policies = (await this.knex<sql.DoorAccessPolicy>('door_access_policies').where({ door_name: door.name })).map(this.convertAccess);

      return {
        ...door,
        accessPolicies: policies,
        studentIds: [],
      }
    });

  getDoors = (context: context.UserContext): Promise<gql.Door[]> =>
    this.withAccess('core:access:door:read', context, async () => {
      const doors = await this.knex<sql.Door>('doors');
      return doors;
    });

  createDoor = (context: context.UserContext, input: gql.CreateDoor): Promise<gql.Maybe<gql.Door>> =>
    this.withAccess('core:access:door:create', context, async () => {
      const door = await this.knex<sql.Door>('doors').insert(input).returning('*').first();
      return door;
    })

  removeDoor = (context: context.UserContext, name: string): Promise<gql.Maybe<gql.Door>> =>
    this.withAccess('core:access:door:delete', context, async () => {
      const door = await this.knex<sql.Door>('doors').where({ name }).delete().returning('*').first();
      return door;
    })

  getApi = (context: context.UserContext, name: string): Promise<gql.Maybe<gql.Api>> =>
    this.withAccess('core:access:api:read', context, async () => {
      const policies = (await this.knex<ApiAccessPolicy>('api_access_policies').where({ api_name: name })).map(this.convertAccess);

      return {
        name,
        accessPolicies: policies,
      }
    });

  /**
   * Returns all Apis that the user has access to.
   * @param context
   */
  getApis = (context: context.UserContext): Promise<gql.Api[]> =>
    this.withAccess('core:access:api:read', context, async () => {
      const policies = await this.knex<ApiAccessPolicy>('api_access_policies');

      return [...new Set(policies.filter(p => this.verifyAccess([p], context)))].map(p => ({name: p.api_name}));
    });

  getAccessPolicy = (context: context.UserContext, id: UUID): Promise<gql.Maybe<gql.AccessPolicy>> =>
    this.withAccess('core:access:policy:read', context, async () => {
      const policy = await this.knex<sql.DoorAccessPolicy | ApiAccessPolicy>('door_access_policies')
        .fullOuterJoin('api_access_policies', 'door_access_policies.id', 'api_access_policies.id')
        .where({ id })
        .first();

      if (!policy)
        return undefined;

      return this.convertAccess(policy);
    });

  getAccessPolicies = (context: context.UserContext): Promise<gql.AccessPolicy[]> =>
    this.withAccess('core:access:policy:read', context, async () => {
      const policies = await this.knex<sql.DoorAccessPolicy | ApiAccessPolicy>('door_access_policies')
        .fullOuterJoin('api_access_policies', 'door_access_policies.id', 'api_access_policies.id');

      return policies.map(this.convertAccess);
    });

  hasApiAccess = async (context: context.UserContext, name: string): Promise<boolean> => {
    try {
      await this.withAccess(name, context, async () => {})
      return true;
    } catch (e) {
      return false;
    }
  }

  private isRole(role: string): boolean {
    const roleRegex = /^\w+(\.\w+)*$/;
    return role === '*' || roleRegex.test(role);
  }

  private isStudentId(studentId: string): boolean {
    const oldStudentIdRegex = /^[a-z]{3}\d{2}[a-z]{3}$/;
    const studentIdRegex = /^[a-z]{2}\d{4}[a-z]{2}(-s)?$/;

    return studentIdRegex.test(studentId) || oldStudentIdRegex.test(studentId);
  }

  private setWho(create: sql.CreateDoorAccessPolicy | sql.CreateApiAccessPolicy, who: string) {
    if (this.isRole(who)) {
      create.role = who;
    } else if (this.isStudentId(who)) {
      create.student_id = who;
    } else {
      throw new UserInputError('field "who" does not match the format of a role or student id.');
    }
  }

  createDoorAccessPolicy = (context: context.UserContext, input: gql.CreateDoorAccessPolicy): Promise<gql.Maybe<gql.AccessPolicy>> =>
    this.withAccess('core:access:policy:create', context, async () => {
      const create: sql.CreateDoorAccessPolicy = {
        door_name: input.doorName,
      }

      this.setWho(create, input.who);

      const policy = await this.knex<sql.DoorAccessPolicy>('door_access_policies').insert(create).returning('*').first();

      if (!policy)
        return undefined;

      return this.convertAccess(policy);
    });

  createApiAccessPolicy = (context: context.UserContext, input: gql.CreateApiAccessPolicy): Promise<gql.Maybe<gql.AccessPolicy>> =>
    this.withAccess('core:access:policy:create', context, async () => {
      const create: sql.CreateApiAccessPolicy = {
        api_name: input.apiName,
      }

      this.setWho(create, input.who);

      const policy = await this.knex<ApiAccessPolicy>('api_access_policies').insert(create).returning('*').first();

      if (!policy)
        return undefined;

      return this.convertAccess(policy);
    });

  removeAccessPolicy = (context: context.UserContext, id: UUID): Promise<gql.AccessPolicy> =>
    this.withAccess('core:access:policy:delete', context, async () => {
      const policy = await this.knex<sql.DoorAccessPolicy | ApiAccessPolicy>('door_access_policies')
        .fullOuterJoin('api_access_policies', 'door_access_policies.id', 'api_access_policies.id')
        .where({ id })
        .delete()
        .returning('*')
        .first();

      return this.convertAccess(policy);
    });
}