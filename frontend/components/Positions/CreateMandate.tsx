import { Stack } from '@mui/material';
import React, { useState } from 'react';
import {
  GetPositionsQuery,
  useCreateMandateMutation,
} from '~/generated/graphql';
import MembersSelector from '~/components/Members/MembersSelector';
import { useCurrentMandates } from '~/hooks/useCurrentMandates';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';

const CreateMandate = ({
  position,
}: {
  position: GetPositionsQuery['positions']['positions'][number];
}) => {
  const { t } = useTranslation(['common']);
  const { refetchMandates } = useCurrentMandates();
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState<number>(null);
  const [createMandateMutation, { loading }] = useCreateMandateMutation({
    variables: {
      memberId: selectedMemberToAdd,
      positionId: position.id,
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(new Date().getFullYear(), 12, 31),
    },
    onCompleted: () => {
      refetchMandates();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return (
    <Stack direction="row" spacing={2} marginTop="auto">
      <MembersSelector setSelectedMember={setSelectedMemberToAdd} />
      <LoadingButton
        variant="outlined"
        onClick={() => createMandateMutation()}
        disabled={!selectedMemberToAdd}
        style={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
        loading={loading}
      >
        {t('add')}
      </LoadingButton>
    </Stack>
  );
};

export default CreateMandate;
