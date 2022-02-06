import React, { PropsWithChildren, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type YesNoDialogProps = PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
  handleYes: () => void;
  textToConfirm: string;
}>;

export default function StrongYesNoDialog({
  open, setOpen, handleYes, children, textToConfirm,
}: YesNoDialogProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

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
      <DialogContent id="alert-dialog-title">
        {children}
        <Stack spacing={1}>
          <Typography>
            {t('typeInConfirm').replace('$NAME', textToConfirm)}
          </Typography>
          <TextField value={text} onChange={(e) => { setText(e.target.value); }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleYes();
            handleClose();
          }}
          disabled={text !== textToConfirm}
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
