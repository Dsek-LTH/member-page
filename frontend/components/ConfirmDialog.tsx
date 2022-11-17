import React, { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'next-i18next';

type ConfirmDialogProps = PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
  handler: (value: boolean) => void;
  buttonDisabled?: boolean;
}>;

export default function ConfirmDialog({
  open, setOpen, handler, buttonDisabled, children,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

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
          disabled={buttonDisabled}
          onClick={() => {
            handler(true);
            handleClose();
          }}
        >
          {t('ok')}
        </Button>
        <Button
          onClick={() => {
            handler(false);
            handleClose();
          }}
          autoFocus
        >
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
