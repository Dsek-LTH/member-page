import React from 'react';
import { Navigate } from 'react-big-calendar';
import { IconButton, Stack, Typography } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { CustomToolbarProps } from '..';

export default function Toolbar({ label, onNavigate }: CustomToolbarProps) {
  const navigate = (action) => {
    onNavigate(action);
  };

  return (
    <Stack
      alignItems="center"
      direction="row"
      style={{ marginBottom: '1rem' }}
      spacing={1}
    >
      <IconButton onClick={() => navigate(Navigate.PREVIOUS)}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={() => navigate(Navigate.NEXT)}>
        <KeyboardArrowRight />
      </IconButton>
      <Typography style={{ textTransform: 'capitalize' }}>{label}</Typography>
    </Stack>
  );
}
