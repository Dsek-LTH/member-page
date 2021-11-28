import React, { useState } from 'react';
import {
  GetMandatesByPeriodQuery,
  useRemoveMandateMutation,
} from '~/generated/graphql';
import Link from 'components/Link';
import routes from '~/routes';
import { getFullName } from '~/functions/memberFunctions';
import { Stack, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import YesNoDialog from '../YesNoDialog';
import { useTranslation } from 'react-i18next';
import { selectTranslation } from '~/functions/selectTranslation';
import { useCurrentMandates } from '~/hooks/useCurrentMandates';

const Mandate = ({
  mandate,
}: {
  mandate: GetMandatesByPeriodQuery['mandates']['mandates'][number];
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { i18n } = useTranslation();
  const { refetchMandates } = useCurrentMandates();
  const [removeMandateMutation, { loading }] = useRemoveMandateMutation({
    variables: {
      mandateId: mandate.id,
    },
    onCompleted: () => {
      refetchMandates();
    },
    onError: (error) => {
      console.error(error);
    },
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
          <Typography> {getFullName(mandate.member)}</Typography>
        </Link>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            {mandate.start_date} till {mandate.end_date}
          </Typography>
          <IconButton onClick={() => setDeleteDialogOpen(true)}>
            <DeleteIcon />
          </IconButton>
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
          `Är du säker på att du vill ta bort ${getFullName(
            mandate.member
          )}s mandat?`,
          `Are you certain that you want to remove ${getFullName(
            mandate.member
          )}'s mandate?`
        )}
      </YesNoDialog>
    </>
  );
};

export default Mandate;
