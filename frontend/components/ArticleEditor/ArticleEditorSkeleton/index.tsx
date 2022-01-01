import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

export default function ArticleEditorSkeleton() {
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
      <Skeleton variant="rectangular" height={200} />
    </Stack>
  );
}
