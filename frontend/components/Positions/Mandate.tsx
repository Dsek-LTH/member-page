import React, { useState } from 'react';
import Link from 'components/Link';
import { Stack, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import {
  GetMandatesByPeriodQuery,
  useRemoveMandateMutation,
} from '~/generated/graphql';
import routes from '~/routes';
import { getFullName } from '~/functions/memberFunctions';
import YesNoDialog from '../YesNoDialog';
import selectTranslation from '~/functions/selectTranslation';
import useCurrentMandates from '~/hooks/useCurrentMandates';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

function Mandate({
  mandate,
}: {
  mandate: GetMandatesByPeriodQuery['mandates']['mandates'][number];
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const apiContext = useApiAccess();
  const { refetchMandates } = useCurrentMandates();
  const { showMessage } = useSnackbar();
  const [removeMandateMutation] = useRemoveMandateMutation({
    variables: {
      mandateId: mandate.id,
    },
    onCompleted: () => {
      refetchMandates();
      showMessage(t('committee:mandateRemoved'), 'success');
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <Link href={routes.member(mandate.member.id)} key={mandate.id}>
          <Typography>
            {' '}
            {getFullName(mandate.member)}
          </Typography>
        </Link>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            {mandate.start_date}
            {' '}
            till
            {mandate.end_date}
          </Typography>
          {hasAccess(apiContext, 'core:mandate:delete') && (
            <IconButton onClick={() => setDeleteDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <YesNoDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleYes={() => {
          removeMandateMutation();
        }}
      >
        {selectTranslation(
          i18n,
          `${t('confirmRemoval')} ${getFullName(
            mandate.member,
          )}s mandat?`,
          `${t('confirmRemoval')} ${getFullName(
            mandate.member,
          )}'s mandate?`,
        )}
      </YesNoDialog>
    </>
  );
}

export default Mandate;
