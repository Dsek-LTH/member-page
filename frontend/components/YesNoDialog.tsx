import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function YesNoDialog({ open, setOpen, handleYes, children }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent id="alert-dialog-title">{children}</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleYes();
            handleClose();
          }}
        >
          OK
        </Button>
        <Button onClick={handleClose} autoFocus>
          Avbryt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
