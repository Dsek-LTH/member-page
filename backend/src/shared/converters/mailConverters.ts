import * as sql from '../../types/database';
import * as gql from '../../types/graphql';

export function convertSpecialSender(sender: sql.SpecialSender): gql.SpecialSender {
  return ({
    id: sender.id,
    studentId: sender.student_id,
    keycloakId: sender.keycloak_id,
  });
}

export function convertSpecialReceiver(receiver: sql.SpecialReceiver): gql.SpecialReceiver {
  return ({
    id: receiver.id,
    targetEmail: receiver.target_email,
  });
}
