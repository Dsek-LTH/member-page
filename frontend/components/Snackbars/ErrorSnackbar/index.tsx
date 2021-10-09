import React from 'react';
import { Alert, Snackbar } from '@mui/material';

type ErrorSnackbarProps = {
  open: boolean;
  onClose: (boolean: boolean) => void;
  message: string;
};

export default function ErrorSnackbar({
  open,
  onClose,
  message,
}: ErrorSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => onClose(false)}
    >
      <Alert onClose={() => onClose(false)} severity="error" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
