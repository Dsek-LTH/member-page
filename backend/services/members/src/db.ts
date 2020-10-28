import { database as knex } from 'dsek-shared';

type stil_id = string;

interface DbMember {
  stil_id: stil_id,
  name: string,
  programme: string,
  first_year: number,
}

const getMember = (stil_id: stil_id): Promise<DbMember | undefined> => {
  return knex<DbMember>('members')
    .select('*')
    .where({stil_id: stil_id})
    .first()
    .catch((reason: any) => undefined)
}

export {
  DbMember,
  getMember,
}