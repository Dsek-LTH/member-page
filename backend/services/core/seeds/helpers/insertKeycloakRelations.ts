import { Knex } from 'knex';
import { Keycloak } from '~/src/types/database';

export default async function insertKeycloakRelations(
  knex: Knex,
  memberIds: string[],
): Promise<void> {
  await knex<Keycloak>('keycloak').insert([
    {
      member_id: memberIds[0],
      keycloak_id: '089965a5-05bd-4271-ad92-d1ede7f54564',
    },
    {
      member_id: memberIds[1],
      keycloak_id: '2eed06cc-6c18-48de-9a06-6616744cc624',
    },
    {
      member_id: memberIds[2],
      keycloak_id: '88142f8e-a0d1-42fc-b486-758f56b114e4',
    },
    {
      member_id: memberIds[3],
      keycloak_id: '526583e8-b4eb-4ac6-9291-43fe94218278',
    },
    {
      member_id: memberIds[4],
      keycloak_id: '164298da-fb22-4732-b790-080cac4cb542',
    },
    {
      member_id: memberIds[5],
      keycloak_id: '39183db7-c91d-4c68-be35-eced3342ccf3',
    },
    {
      member_id: memberIds[6],
      keycloak_id: '4eeb75d0-19e1-4a06-81d1-593baf34dfc0',
    },
    {
      member_id: memberIds[7],
      keycloak_id: '791273ee-86fa-4fda-8cdf-18f3d4bb6c86',
    },
  ]);
}
