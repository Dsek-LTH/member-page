import React from 'react';
import { Alert, Snackbar } from '@mui/material';

type SuccessSnackbarProps = {
  open: boolean;
  onClose: (boolean: boolean) => void;
  message: string;
};

export default function SuccessSnackbar({
  open,
  onClose,
  message,
}: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => onClose(false)}
    >
      <Alert onClose={() => onClose(false)} severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
