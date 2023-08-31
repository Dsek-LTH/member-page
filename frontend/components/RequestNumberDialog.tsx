import React, { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'next-i18next';
import { Stack, TextField } from '@mui/material';

type ConfirmDialogProps = PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
  handler: (value: number) => void;
  label: string;
  buttonDisabled?: boolean;
}>;

export default function RequestNumberDialog({
  open,
  setOpen,
  handler,
  buttonDisabled,
  children,
  label,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const [number, setNumber] = React.useState('');

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
      <DialogContent id="alert-dialog-title">
        <Stack spacing={2}>
          {children}
          <TextField
            style={{
              marginTop: '1rem',
            }}
            placeholder={label}
            label={label}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={buttonDisabled || Number.isNaN(Number(number)) || !number}
          onClick={() => {
            handler(Number(number));
            setNumber('');
            handleClose();
          }}
        >
          {t('ok')}
        </Button>
        <Button
          onClick={() => {
            setNumber('');
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
