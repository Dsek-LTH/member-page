import knex from '../../database';

type stil_id = string;

interface IDbMember {
  stil_id: stil_id,
  name: string,
  programme: string,
  first_year: number,
}

const getMember = (stil_id: stil_id): Promise<IDbMember | undefined> => {
  return knex<IDbMember>('members')
    .select('*')
    .where({stil_id: stil_id})
    .first()
    .catch((reason: any) => undefined)
}

export {
  IDbMember,
  getMember,
}