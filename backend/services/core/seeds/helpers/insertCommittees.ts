import { Knex } from 'knex';
import { Committee } from '~/src/types/database';

export default async function insertCommittees(knex: Knex): Promise<string[]> {
  return (await knex<Committee>('committees').insert([
    { name: 'Cafémästeriet', short_name: 'cafe' },
    { name: 'Näringslivsutskottet', short_name: 'nari' },
    { name: 'Källarmästeriet', short_name: 'km' },
    { name: 'Aktivitetsutskottet', short_name: 'aktu' },
    { name: 'Informationsutskottet', short_name: 'infu' },
    { name: 'Sexmästeriet', short_name: 'sexm' },
    { name: 'Skattmästeriet', short_name: 'skattm' },
    { name: 'Studierådet', short_name: 'srd' },
    { name: 'Nollningsutskottet', short_name: 'nollu' },
  ]).returning('id')).map((v) => v.id);
}
