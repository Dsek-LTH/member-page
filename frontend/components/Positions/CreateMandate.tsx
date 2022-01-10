import { Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { LoadingButton, DatePicker } from '@mui/lab';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import useCurrentMandates from '~/hooks/useCurrentMandates';
import MembersSelector from '~/components/Members/MembersSelector';
import {
  GetPositionsQuery,
  useCreateMandateMutation,
} from '~/generated/graphql';
import thisYear from '~/functions/thisYear';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

const defaultFromDate = DateTime.fromISO(`${thisYear}-01-01`);
const defaultToDate = DateTime.fromISO(`${thisYear}-12-31`);

function CreateMandate({
  position,
}: {
  position?: GetPositionsQuery['positions']['positions'][number];
}) {
  const [startDate, setStartDate] = useState(defaultFromDate);
  const [endDate, setEndDate] = useState(defaultToDate);
  const { t, i18n } = useTranslation(['common', 'committee']);
  const { refetchMandates } = useCurrentMandates();
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState<number>(null);
  const { showMessage } = useSnackbar();

  const [createMandateMutation, { loading }] = useCreateMandateMutation({
    variables: {
      memberId: selectedMemberToAdd,
      positionId: position && position.id,
      startDate,
      endDate,
    },
    onCompleted: () => {
      refetchMandates();
      showMessage(t('committee:mandateCreated'), 'success');
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });
  const disabled = !selectedMemberToAdd || !position;
  return (
    <Stack spacing={2} marginTop="auto">
      <Stack direction="row" spacing={2} width="100%">
        <LocalizationProvider dateAdapter={AdapterLuxon} locale={i18n.language}>
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </LocalizationProvider>
      </Stack>
      <Stack direction="row" spacing={2} width="100%">
        <MembersSelector setSelectedMember={setSelectedMemberToAdd} />
        <LoadingButton
          variant="outlined"
          onClick={() => {
            if (!disabled) {
              createMandateMutation();
            }
          }}
          disabled={disabled}
          style={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
          loading={loading}
        >
          {t('add')}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

export default CreateMandate;
