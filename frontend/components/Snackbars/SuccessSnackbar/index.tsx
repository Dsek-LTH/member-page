import React from 'react';
import { Alert, Snackbar } from '@material-ui/core';

type ErrorSnackbarProps = {
  open: boolean;
  onClose: (boolean: boolean) => void;
  message: string;
}

export default function SuccessSnackbar({ open, onClose, message }: ErrorSnackbarProps) {

  return (
    <Snackbar open={open}
      autoHideDuration={6000}
      onClose={() => onClose(false)}
    >
      <Alert onClose={() => onClose(false)} severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}