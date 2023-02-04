import * as sql from '~/src/types/database';

export const specialReceivers: sql.SpecialReceiver[] = [
  {
    id: '9ba28a60-54c5-4f2d-88af-c918de110960',
    email: 'test@email.com',
    target_email: 'oliver@levay.se',
  },
  {
    id: 'b7f491ca-33c3-45b9-913c-065710a4be8c',
    email: 'test@email.com',
    target_email: 'oliver2@levay.se',
  },
  {
    id: 'db932869-d7d7-4b30-96bd-eb64d10c5b71',
    email: 'test2@email.com',
    target_email: 'oliver3@levay.se',
  },
];

export const specialSenders: sql.SpecialSender[] = [
  {
    id: '4d211cc7-49a2-4b08-8de7-bef8d2e2c8d2',
    email: 'test@email.com',
    student_id: 'oliver',
    keycloak_id: 'oliver_levay',
  },
  {
    id: 'bae9b507-2e01-411a-951a-242d491f685d',
    email: 'test@email.com',
    student_id: 'fabian',
    keycloak_id: 'fabian_levay',
  },
  {
    id: '6da1ccdf-07b0-4b53-8796-92fa77bf3f1d',
    email: 'test2@email.com',
    student_id: 'test2',
    keycloak_id: 'test2',
  },
];
