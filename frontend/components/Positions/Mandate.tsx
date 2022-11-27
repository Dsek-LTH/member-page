import React from 'react';
import Link from 'components/Link';
import {
  Stack, Typography, IconButton, Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'next-i18next';
import {
  PositionsByCommitteeQuery,
  useRemoveMandateMutation,
} from '~/generated/graphql';
import routes from '~/routes';
import { getFullName } from '~/functions/memberFunctions';
import selectTranslation from '~/functions/selectTranslation';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import { useDialog } from '~/providers/DialogProvider';

function Mandate({
  mandate,
  refetch,
}: {
  mandate: PositionsByCommitteeQuery['positions']['positions'][number]['activeMandates'][number];
  refetch: () => void;
}) {
  const { t, i18n } = useTranslation();
  const apiContext = useApiAccess();
  const { confirm } = useDialog();
  const { showMessage } = useSnackbar();
  const [removeMandateMutation] = useRemoveMandateMutation({
    variables: {
      mandateId: mandate.id,
    },
    onCompleted: () => {
      refetch();
      showMessage(t('committee:mandateRemoved'), 'success');
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });
  return (
    <Stack
      direction="row"
      width="100%"
      alignItems="center"
      spacing={1}
    >
      <Avatar src={mandate.member.picture_path} />
      <Stack>
        <Link href={routes.member(mandate.member.student_id)} key={mandate.id}>
          <Typography>
            {' '}
            {getFullName(mandate.member)}
          </Typography>
        </Link>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            {mandate.start_date}
            {' - '}
            {mandate.end_date}
          </Typography>
        </Stack>
      </Stack>
      {hasAccess(apiContext, 'core:mandate:delete') && (
        <IconButton onClick={() => {
          confirm(selectTranslation(
            i18n,
            `${t('confirmRemoval')} ${getFullName(
              mandate.member,
            )}s mandat?`,
            `${t('confirmRemoval')} ${getFullName(
              mandate.member,
            )}'s mandate?`,
          ), (confirmed) => {
            if (confirmed) removeMandateMutation();
          });
        }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Stack>
  );
}

export default Mandate;
