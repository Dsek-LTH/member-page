import { Knex } from 'knex';
import { Committee } from '~/src/types/database';

export default async function insertCommittees(knex: Knex): Promise<string[]> {
  return (await knex<Committee>('committees').insert([
    { name: 'Cafémästeriet', name_en: 'Café Department', short_name: 'cafe' },
    { name: 'Näringslivsutskottet', name_en: 'Business Committee', short_name: 'nari' },
    { name: 'Källarmästeriet', name_en: 'Basement Department', short_name: 'km' },
    { name: 'Aktivitetsutskottet', name_en: 'Activities Committee', short_name: 'aktu' },
    { name: 'Informationsutskottet', name_en: 'Information Committee', short_name: 'infu' },
    { name: 'Sexmästeriet', name_en: 'Party Department', short_name: 'sexm' },
    { name: 'Skattmästeriet', name_en: 'Treasury Department', short_name: 'skattm' },
    { name: 'Studierådet', name_en: 'Study Council', short_name: 'srd' },
    { name: 'Nollningsutskottet', name_en: 'Initiation Committee', short_name: 'nollu' },
  ]).returning('id')).map((v) => v.id);
}
