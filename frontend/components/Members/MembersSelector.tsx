import { Stack } from '@mui/material';
import React from 'react';
import SearchInput from '../Header/SearchInput';

interface MemberSelectorProps {
  setSelectedMember: (memberId: any) => void;
}

function MembersSelector({ setSelectedMember }: MemberSelectorProps) {
  return (
    <Stack direction="row" spacing={2} width="100%">
      <SearchInput onSelect={(_, memberId) => {
        setSelectedMember(memberId);
      }}
      />
    </Stack>
  );
}

export default MembersSelector;
