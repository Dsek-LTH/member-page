import React, { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

type YesNoDialogProps = PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
  handleYes: () => void;
}>;

export default function YesNoDialog({
  open, setOpen, handleYes, children,
}: YesNoDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: '1rem' }}
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
