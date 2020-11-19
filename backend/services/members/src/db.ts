import { database as knex } from 'dsek-shared';

interface DbMember {
  id: number,
  student_id: string,
  first_name: string,
  nickname: string,
  last_name: string,
  class_programme: string,
  class_year: number,
  picture_path: string,
}

const getMember = async (identifier: {keycloak_id?: string, id?: number}): Promise<DbMember | undefined> => {
  if (identifier.id) {
    return knex<DbMember>('members')
      .select('*')
      .where({id: identifier.id})
      .first()
      .catch((reason: any) => {
        return undefined
      })
  } else if (identifier.keycloak_id) {
    return knex<DbMember>('members')
      .select('members.*')
      .join('keycloak', {'members.id': 'keycloak.member_id'})
      .where({keycloak_id: identifier.keycloak_id})
      .first()
      .catch((reason: any) => {
        return undefined
      })
  } else {
    console.log('No indentifier given');
    return undefined;
  }
}

export {
  DbMember,
  getMember,
}