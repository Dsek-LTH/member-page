import {
  MailAlias, Position, Member, Mandate, Keycloak,
} from '~/src/types/database';

const thisYear = new Date().getFullYear();

// eslint-disable-next-line import/prefer-default-export
export const positions: Position[] = [{
  id: 'dsek.infu.dwww.mdlm',
  name: 'DWWW medlem',
  name_en: null,
  committee_id: null,
  active: true,
  email: 'dwww-medlem@dsek.se',
  board_member: false,
  description: null,
  description_en: null,
}, {
  id: 'dsek.infu.dwww.mastare',
  name: 'DWWW Ansvarig',
  name_en: null,
  committee_id: null,
  active: false,
  email: 'dwww-ansvarig@dsek.se',
  board_member: false,
  description: null,
  description_en: null,
}, {
  id: 'dsek.km.rootm.root',
  name: 'root',
  name_en: null,
  committee_id: null,
  active: true,
  email: 'root@dsek.se',
  board_member: false,
  description: null,
  description_en: null,
}, {
  id: 'dsek.km.rootm.sudo',
  name: 'root',
  name_en: null,
  committee_id: null,
  active: true,
  email: 'sudo@dsek.se',
  board_member: false,
  description: null,
  description_en: null,
}];

export const members: Member[] = [{
  id: 'ab8b0b1a-5b1f-4b0e-8c1c-1a1a1a1a1a1a',
  student_id: 'oliver',
  first_name: 'Oliver',
  nickname: 'Oliver',
  last_name: 'Oliver',
  class_programme: 'Oliver',
  class_year: 2020,
  picture_path: 'Oliver',
  visible: true,
}, {
  id: 'eba39f18-0247-4a48-a493-1b1b1b1b1b1b',
  student_id: 'oliver2',
  first_name: 'Oliver2',
  nickname: 'Oliver2',
  last_name: 'Oliver2',
  class_programme: 'Oliver2',
  class_year: 2020,
  picture_path: 'Oliver2',
  visible: true,
}, {
  id: 'aba39f18-0247-4a48-a493-1c1c1c1c1c1c',
  student_id: 'oliver3',
  first_name: 'Oliver3',
  nickname: 'Oliver3',
  last_name: 'Oliver3',
  class_programme: 'Oliver3',
  class_year: 2020,
  picture_path: 'Oliver3',
  visible: true,
}, {
  id: 'aba39f18-0247-4a48-a493-1d1d1d1d1d1d',
  student_id: 'oliver4',
  first_name: 'Oliver4',
  nickname: 'Oliver4',
  last_name: 'Oliver4',
  class_programme: 'Oliver4',
  class_year: 2020,
  picture_path: 'Oliver4',
  visible: true,
}];

export const keycloakUsers = [{
  keycloakId: 'aaf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
  email: 'oliver@dsek.se',
  studentId: 'oliver',
}, {
  keycloakId: 'ab1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
  email: 'oliver2@dsek.se',
  studentId: 'oliver2',
},
{
  keycloakId: 'ac1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
  email: 'oliver3@dsek.se',
  studentId: 'oliver3',
},
{
  keycloakId: 'ad1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
  email: 'oliver4@dsek.se',
  studentId: 'oliver4',
}];

export const keycloaks: Keycloak[] = [{
  member_id: members[0].id,
  keycloak_id: keycloakUsers[0].keycloakId,
},
{
  member_id: members[1].id,
  keycloak_id: keycloakUsers[1].keycloakId,
},
{
  member_id: members[2].id,
  keycloak_id: keycloakUsers[2].keycloakId,
},
{
  member_id: members[3].id,
  keycloak_id: keycloakUsers[3].keycloakId,
},
];

export const mandates: Mandate[] = [{
  id: '15f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: false,
  start_date: new Date('2021-01-01 00:00:00'),
  end_date: new Date('2021-12-31 23:59:59'),
  member_id: members[0].id,
  position_id: positions[0].id,
},
{
  id: '26f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: false,
  start_date: new Date('2021-01-01 00:00:00'),
  end_date: new Date('2021-12-31 23:59:59'),
  member_id: members[1].id,
  position_id: positions[0].id,
},
{
  id: '37f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: true,
  start_date: new Date(`${thisYear}-01-01 00:00:00`),
  end_date: new Date(`${thisYear}-12-31 23:59:59`),
  member_id: members[2].id,
  position_id: positions[0].id,
},
{
  id: '47f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: true,
  start_date: new Date(`${thisYear}-01-01 00:00:00`),
  end_date: new Date(`${thisYear}-12-31 23:59:59`),
  member_id: members[3].id,
  position_id: positions[1].id,
}];

export const aliases: MailAlias[] = [{
  id: 'ad8b0b1a-5b1f-4b0e-8c1c-1c1c1c1c1c1c',
  email: 'dwww@dsek.se',
  position_id: positions[0].id,
  can_send: true,
}, {
  id: 'e2a39f18-0247-4a48-a493-c0184af0fecd',
  email: 'dwww@dsek.se',
  position_id: positions[1].id,
  can_send: true,
}, {
  id: 'a3a39f18-0247-4a48-a493-c0184af0fecd',
  email: 'rootm@dsek.se',
  position_id: positions[2].id,
  can_send: true,
}, {
  id: 'a4a39f18-0247-4a48-a493-c0184af0fecd',
  email: 'rootm@dsek.se',
  position_id: positions[3].id,
  can_send: true,
}];
