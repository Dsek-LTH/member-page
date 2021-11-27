import { Stack, Autocomplete, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { GetMembersQuery, Member } from '~/generated/graphql';
import { useMembers } from '~/hooks/useMembers';

const fullName = (member: GetMembersQuery['members']['members'][number]) => {
  return `${member.first_name} ${member.nickname || ''} ${member.last_name} (${
    member.student_id
  })`;
};

const MembersSelector = ({ setSelectedMember }) => {
  const members = useMembers();

  return (
    <Stack direction="row" spacing={2} width="100%">
      <Autocomplete
        onChange={(
          e,
          member: GetMembersQuery['members']['members'][number]
        ) => {
          if (member) {
            setSelectedMember(member.id);
          } else {
            setSelectedMember(null);
          }
        }}
        sx={{ width: '100%' }}
        options={members.map((member) => {
          return { ...member, label: fullName(member) };
        })}
        renderInput={(params) => <TextField {...params} label="Member" />}
        isOptionEqualToValue={() => true}
      />
    </Stack>
  );
};

export default MembersSelector;
