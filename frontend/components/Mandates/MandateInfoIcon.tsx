import {
  AccountCircle, Circle, Key, LocalCafe, MoreHoriz,
} from '@mui/icons-material';
import React from 'react';

export default function CommitteeIcon(props: any) {
  const { name } = props;
  switch (name) {
    case 'access':
      return <Key {...props} />;
    case 'account':
      return <AccountCircle {...props} />;
    case 'benefits':
      return <LocalCafe {...props} />;
    case 'other':
      return <MoreHoriz {...props} />;
    default:
      return <Circle {...props} />;
  }
}
