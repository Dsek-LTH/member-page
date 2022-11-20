import { Knex } from 'knex';
import { DoorAccessPolicy } from '~/src/types/database';

export default async function insertDoorAccessPolicies(knex: Knex): Promise<void> {
  await knex<DoorAccessPolicy>('door_access_policies').insert([
    { door_name: 'idet', role: 'dsek.infu.dwww' },
    { door_name: 'idet', student_id: 'dat15fno' },
  ]);
}
