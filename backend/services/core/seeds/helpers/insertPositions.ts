import { Knex } from 'knex';
import { Position } from '~/src/types/database';

export default async function insertPositions(
  knex: Knex,
  committeesIds: string[],
): Promise<string[]> {
  return (await knex<Position>('positions').insert([
    { id: 'dsek.cafe.dagsansv', name: 'Dagsansvarig', committee_id: committeesIds[0] },
    {
      id: 'dsek.infu.dwww.mastare', name: 'DWWW-ansvarig', description: 'DWWW-ansvarig leder DWWW.', committee_id: committeesIds[4],
    },
    {
      id: 'dsek.infu.fotograf', name: 'Fotograf', name_en: 'Photographer', committee_id: committeesIds[4],
    },
    { id: 'dsek.skattm.funk', name: 'Funktionär inom Skattmästeriet', committee_id: committeesIds[6] },
    { id: 'dsek.km.rootm.sudo', name: 'sudo', committee_id: committeesIds[2] },
    { id: 'dsek.aktu.tandemgen', name: 'Tandemgeneral', committee_id: committeesIds[3] },
    { id: 'dsek.noll.funk', name: 'Nollningsfunktionär', committee_id: committeesIds[8] },
    { id: 'dsek.sex.vinfm', name: 'Vinförman', committee_id: committeesIds[5] },
    {
      id: 'dsek.sex.sektkock', name: 'Sektionskock', committee_id: committeesIds[5], board_member: true,
    },
    { id: 'dsek.skattm.mastare', name: 'Skattmästare', committee_id: committeesIds[6] },
    { id: 'dsek.infu.artist', name: 'Artist', committee_id: committeesIds[4] },
    {
      id: 'dsek.infu.dwww', name: 'DWWW-medlem', description: 'DWWW-medlem hjälper DWWW-ansvarig med arbetet inom DWWW.', committee_id: committeesIds[4], board_member: true,
    },
    { id: 'dsek.km.mastare', name: 'Källarmästare', committee_id: committeesIds[2] },
    { id: 'dsek.infu.dwww-king', name: 'DWWW-king', committee_id: null },
  ]).returning('id')).map((v) => v.id);
}
