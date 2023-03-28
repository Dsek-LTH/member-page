import {
  Mandate, Keycloak, Member, Position,
} from '~/src/types/database';

export const members: Member[] = [{
  id: 'ad8b0b1a-5b1f-4b0e-8c1c-1c1c1c1c1c1c',
  student_id: 'oliver',
  first_name: 'Oliver',
  nickname: 'Oliver',
  last_name: 'Oliver',
  class_programme: 'Oliver',
  class_year: 2020,
  picture_path: 'Oliver',
  visible: true,
}, {
  id: 'e2a39f18-0247-4a48-a493-c0184af0fecd',
  student_id: 'oliver2',
  first_name: 'Oliver2',
  nickname: 'Oliver2',
  last_name: 'Oliver2',
  class_programme: 'Oliver2',
  class_year: 2020,
  picture_path: 'Oliver2',
  visible: true,
}, {
  id: 'a3a39f18-0247-4a48-a493-c0184af0fecd',
  student_id: 'oliver3',
  first_name: 'Oliver3',
  nickname: 'Oliver3',
  last_name: 'Oliver3',
  class_programme: 'Oliver3',
  class_year: 2020,
  picture_path: 'Oliver3',
  visible: true,
}, {
  id: 'a4a39f18-0247-4a48-a493-c0184af0fecd',
  student_id: 'oliver4',
  first_name: 'Oliver4',
  nickname: 'Oliver4',
  last_name: 'Oliver4',
  class_programme: 'Oliver4',
  class_year: 2020,
  picture_path: 'Oliver4',
  visible: true,
}];

export const positions: Position[] = [{
  id: 'dsek.infu.dwww',
  name: 'DWWW king',
  name_en: null,
  committee_id: null,
  active: true,
  board_member: false,
  description: null,
  description_en: null,
}, {
  id: 'dsek.infu.dwww.mastare',
  name: 'DWWW queen',
  name_en: null,
  committee_id: null,
  active: false,
  board_member: false,
  description: null,
  description_en: null,
}];

export const expiredMandates: Mandate[] = [{
  id: '15f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: true,
  start_date: new Date('2021-01-01 00:00:00'),
  end_date: new Date('2021-12-31 23:59:59'),
  member_id: members[0].id,
  position_id: positions[0].id,
},
{
  id: '26f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: true,
  start_date: new Date('2021-01-01 00:00:00'),
  end_date: new Date('2021-12-31 23:59:59'),
  member_id: members[1].id,
  position_id: positions[0].id,
}];

const thisYear = new Date().getFullYear();

export const mandatesToAdd: Mandate[] = [{
  id: '37f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: false,
  start_date: new Date(`${thisYear}-01-01 00:00:00`),
  end_date: new Date(`${thisYear}-12-31 23:59:59`),
  member_id: members[2].id,
  position_id: positions[0].id,
},
{
  id: '47f9b9c0-5b9f-4b0f-8c9f-0c9f0c9f0c9f',
  in_keycloak: false,
  start_date: new Date(`${thisYear}-01-01 00:00:00`),
  end_date: new Date(`${thisYear}-12-31 23:59:59`),
  member_id: members[3].id,
  position_id: positions[1].id,
}];

export const keycloakUsers = [{
  keycloakId: 'abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
  email: 'oliver@dsek.se',
  studentId: 'oliver',
}, {
  keycloakId: 'ac1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
  email: 'oliver2@dsek.se',
  studentId: 'oliver2',
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
  keycloak_id: 'k3abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
},
{
  member_id: members[3].id,
  keycloak_id: 'k4abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
},
];

export const keycloakGroups = [
  {
    id: 'abf1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
    name: 'dsek',
    path: '/dsek',
    subGroups: [
      {
        id: 'ad1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
        path: '/dsek/dsek.infu',
        name: 'dsek.infu',
        subGroups: [
          {
            id: 'qb1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
            path: '/dsek/dsek.infu/dsek.infu.dwww',
            name: 'dsek.infu.dwww',
            subGroups: [
              {
                id: 'f1b9d0-7c1d-4b1f-9c1d-7c1d4b1f9c1d',
                name: 'dsek.infu.dwww.mastare',
                path: '/dsek/dsek.infu/dsek.infu.dwww/dsek.infu.dwww.mastare',
              },
            ],
          },
        ],
      },
    ],
  },
];
