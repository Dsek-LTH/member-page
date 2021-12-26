import {
  context, dbUtils, UUID, ApiAccessPolicy,
} from 'dsek-shared';
import { UserInputError } from 'apollo-server-errors';
import * as gql from '../types/graphql';
import * as sql from '../types/database';

export function convertAccess(policy: sql.DoorAccessPolicy | ApiAccessPolicy): gql.AccessPolicy {
  return {
    id: policy.id,
    accessor: policy.role ?? policy.student_id ?? '',
  };
}

export function isRole(role: string): boolean {
  const roleRegex = /^\w+(\.\w+)*$/;
  return role === '*' || roleRegex.test(role);
}

export function isStudentId(studentId: string): boolean {
  const oldStudentIdRegex = /^[a-z]{3}\d{2}[a-z]{3}$/;
  const studentIdRegex = /^[a-z]{2}\d{4}[a-z]{2}(-s)?$/;

  return studentIdRegex.test(studentId) || oldStudentIdRegex.test(studentId);
}

type Policy = sql.CreateDoorAccessPolicy | sql.CreateApiAccessPolicy

export function withWho<T extends Policy>(create: T, who: string): T {
  const policy = { ...create };
  if (isRole(who)) {
    policy.role = who;
  } else if (isStudentId(who)) {
    policy.student_id = who;
  } else {
    throw new UserInputError('field "who" does not match the format of a role or student id.');
  }
  return policy;
}

export default class AccessAPI extends dbUtils.KnexDataSource {
  getDoor(ctx: context.UserContext, name: string): Promise<gql.Maybe<gql.Door>> {
    return this.withAccess('core:access:door:read', ctx, async () => {
      const door = await this.knex<sql.Door>('doors').where({ name }).first();
      if (!door) { return undefined; }

      return {
        ...door,
        accessPolicies: await this.getAccessPoliciesForDoor(door.name),
        studentIds: await this.getStudentIdsForDoor(door.name),
      };
    });
  }

  getDoors(ctx: context.UserContext): Promise<gql.Door[]> {
    return this.withAccess('core:access:door:read', ctx, async () => {
      const doors = await this.knex<sql.Door>('doors');
      return doors;
    });
  }

  createDoor(ctx: context.UserContext, input: gql.CreateDoor): Promise<gql.Maybe<gql.Door>> {
    return this.withAccess('core:access:door:create', ctx, async () => {
      const door = await this.knex<sql.Door>('doors').insert(input).returning('*').first();
      return door;
    });
  }

  removeDoor(ctx: context.UserContext, name: string): Promise<gql.Maybe<gql.Door>> {
    return this.withAccess('core:access:door:delete', ctx, async () => {
      const door = await this.knex<sql.Door>('doors').where({ name }).delete().returning('*')
        .first();
      return door;
    });
  }

  getApi(ctx: context.UserContext, name: string): Promise<gql.Maybe<gql.Api>> {
    return this.withAccess('core:access:api:read', ctx, async () => {
      const policies = (await this.knex<ApiAccessPolicy>('api_access_policies').where({ api_name: name })).map(convertAccess);

      return {
        name,
        accessPolicies: policies,
      };
    });
  }

  /**
   * Returns all Apis that the user has access to.
   * @param ctx
   */
  getApis(ctx: context.UserContext): Promise<gql.Api[]> {
    return this.withAccess('core:access:api:read', ctx, async () => {
      const policies = await this.knex<ApiAccessPolicy>('api_access_policies');

      return [...new Set(policies.filter((p) => dbUtils.verifyAccess([p], ctx)))]
        .map((p) => ({ name: p.api_name }));
    });
  }

  getAccessPolicy(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.AccessPolicy>> {
    return this.withAccess('core:access:policy:read', ctx, async () => {
      const policy = await this.knex<sql.DoorAccessPolicy | ApiAccessPolicy>('door_access_policies')
        .fullOuterJoin('api_access_policies', 'door_access_policies.id', 'api_access_policies.id')
        .where({ id })
        .first();

      if (!policy) { return undefined; }

      return convertAccess(policy);
    });
  }

  private async getAccessPoliciesForDoor(name: string): Promise<gql.AccessPolicy[]> {
    return (await this.knex<sql.DoorAccessPolicy>('door_access_policies').where({ door_name: name })).map(convertAccess);
  }

  private async getStudentIdsForDoor(name: string): Promise<string[]> {
    const policies = await this.knex<sql.DoorAccessPolicy>('door_access_policies').where({ door_name: name });

    const direct = policies.flatMap((p) => (p.student_id ? [p.student_id] : []));

    const today = new Date();

    let positionsQuery = this.knex<sql.Position>('positions');
    policies.forEach((p) => {
      positionsQuery = positionsQuery.orWhere('id', 'like', `${p.role}%`);
    });
    const positions = await positionsQuery;

    const fromRole = (await this.knex<sql.Mandate>('mandates')
      .whereIn('position_id', positions.map((p) => p.id))
      .where('mandates.start_date', '<=', today)
      .where('mandates.end_date', '>=', today)
      .join('members', 'mandates.member_id', 'members.id')
      .select('members.student_id')
        ).map((p) => p.student_id) as string[];

    return fromRole.concat(direct);
  }

  getAccessPolicies(ctx: context.UserContext): Promise<gql.AccessPolicy[]> {
    return this.withAccess('core:access:policy:read', ctx, async () => {
      const policies = await this.knex<sql.DoorAccessPolicy | ApiAccessPolicy>('door_access_policies')
        .fullOuterJoin('api_access_policies', 'door_access_policies.id', 'api_access_policies.id');

      return policies.map(convertAccess);
    });
  }

  createDoorAccessPolicy(
    ctx: context.UserContext,
    input: gql.CreateDoorAccessPolicy,
  ): Promise<gql.Maybe<gql.AccessPolicy>> {
    return this.withAccess('core:access:policy:create', ctx, async () => {
      const create: sql.CreateDoorAccessPolicy = withWho({
        door_name: input.doorName,
      }, input.who);

      const policy = await this.knex<sql.DoorAccessPolicy>('door_access_policies').insert(create).returning('*').first();

      if (!policy) { return undefined; }

      return convertAccess(policy);
    });
  }

  createApiAccessPolicy(
    ctx: context.UserContext,
    input: gql.CreateApiAccessPolicy,
  ): Promise<gql.Maybe<gql.AccessPolicy>> {
    return this.withAccess('core:access:policy:create', ctx, async () => {
      const create: sql.CreateApiAccessPolicy = withWho({
        api_name: input.apiName,
      }, input.who);

      const policy = await this.knex<ApiAccessPolicy>('api_access_policies').insert(create).returning('*').first();

      if (!policy) { return undefined; }

      return convertAccess(policy);
    });
  }

  removeAccessPolicy(ctx: context.UserContext, id: UUID): Promise<gql.AccessPolicy> {
    return this.withAccess('core:access:policy:delete', ctx, async () => {
      const policy = await this.knex<sql.DoorAccessPolicy | ApiAccessPolicy>('door_access_policies')
        .fullOuterJoin('api_access_policies', 'door_access_policies.id', 'api_access_policies.id')
        .where({ id })
        .delete()
        .returning('*')
        .first();

      return convertAccess(policy);
    });
  }
}
