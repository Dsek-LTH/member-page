import { Stack, Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { GetMembersQuery } from '~/generated/graphql';
import useMembers from '~/hooks/useMembers';

const fullName = (member: GetMembersQuery['members']['members'][number]) => `${member.first_name} ${member.nickname || ''} ${member.last_name} (${
  member.student_id
})`;

interface MemberSelectorProps {
  setSelectedMember: (memberId: any) => void;
}

function MembersSelector({ setSelectedMember }: MemberSelectorProps) {
  const { members } = useMembers();

  const { t } = useTranslation('common');

  return (
    <Stack direction="row" spacing={2} width="100%">
      <Autocomplete
        onChange={(
          e,
          member: GetMembersQuery['members']['members'][number],
        ) => {
          if (member) {
            setSelectedMember(member.id);
          } else {
            setSelectedMember(null);
          }
        }}
        sx={{ width: '100%' }}
        options={members.map((member) => ({ ...member, label: fullName(member) }))}
        renderInput={(params) => <TextField {...params} label={t('member')} />}
        isOptionEqualToValue={() => true}
      />
    </Stack>
  );
}

export default MembersSelector;
