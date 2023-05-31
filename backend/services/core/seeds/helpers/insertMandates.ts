import { Knex } from 'knex';
import { Mandate } from '~/src/types/database';

export default async function insertMandates(
  knex: Knex,
  memberIds: string[],
  positionIds: string[],
): Promise<string[]> {
  return (await knex<Mandate>('mandates').insert([
    {
      member_id: memberIds[0], position_id: positionIds[0], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[3], position_id: positionIds[1], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[2], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[3], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[4], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[5], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[6], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[9], start_date: new Date('2020-01-01'), end_date: new Date('2020-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[10], start_date: new Date('2019-01-01'), end_date: new Date('2019-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[11], start_date: new Date('2019-01-01'), end_date: new Date('2019-12-31'),
    },
    {
      member_id: memberIds[0], position_id: positionIds[13], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[2], position_id: positionIds[13], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[5], position_id: positionIds[1], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[3], position_id: positionIds[13], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[4], position_id: positionIds[13], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[6], position_id: positionIds[1], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    {
      member_id: memberIds[6], position_id: positionIds[13], start_date: new Date('2022-01-01'), end_date: new Date('2022-12-31'),
    },
    { // stabsmedlem
      member_id: memberIds[0], position_id: positionIds[7], start_date: new Date('2023-01-01'), end_date: new Date('2023-12-31'),
    },
    { // stabsmedlem
      member_id: memberIds[3], position_id: positionIds[7], start_date: new Date('2023-01-01'), end_date: new Date('2023-12-31'),
    },
    { // stabsmedlem
      member_id: memberIds[4], position_id: positionIds[7], start_date: new Date('2023-01-01'), end_date: new Date('2023-12-31'),
    },
    { // överphös
      member_id: memberIds[6], position_id: positionIds[8], start_date: new Date('2023-01-01'), end_date: new Date('2023-12-31'),
    },
  ]).returning('id')).map((v) => v.id);
}
