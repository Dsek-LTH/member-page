import { Typography } from '@mui/material';
import React from 'react';

export default function PageHeader({ children, noMargin }:
{ children: React.ReactNode, noMargin?: boolean }) {
  return (
    <Typography
      variant="h1"
      fontWeight="bold"
      sx={{
        fontSize: '1.5rem',
        mb: {
          xs: noMargin ? 0 : 1,
          sm: noMargin ? 0 : 2,
        },
      }}
    >
      {children}
    </Typography>
  );
}
