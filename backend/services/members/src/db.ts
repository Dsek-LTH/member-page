import { database as knex } from 'dsek-shared';

interface DbMember {
  id: number,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
}

const getMember = async (identifier: {student_id?: string, id?: number}): Promise<DbMember | undefined> => {
  if (!identifier.id && !identifier.student_id) {
    console.log('No indentifier given');
    return undefined;
  }
  return knex<DbMember>('members')
    .select('*')
    .where(identifier)
    .first()
    .catch((reason: any) => {
      return undefined
    })
}

export {
  DbMember,
  getMember,
}