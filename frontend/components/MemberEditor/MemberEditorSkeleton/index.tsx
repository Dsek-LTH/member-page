import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

export default function MemberEditorSkeleton() {
  return (
    <Stack spacing={2}>
      <Typography variant="h1">
        <Skeleton />
      </Typography>
      <Typography variant="h3">
        <Skeleton />
      </Typography>
      <Typography variant="h3">
        <Skeleton />
      </Typography>
      <Typography variant="h3">
        <Skeleton />
      </Typography>
      <Typography variant="h3">
        <Skeleton />
      </Typography>
    </Stack>
  );
}
