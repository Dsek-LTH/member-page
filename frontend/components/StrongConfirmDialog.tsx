import React, { PropsWithChildren, useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import ConfirmDialog from './ConfirmDialog';

type StrongConfirmDialogProps = PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
  handleYes: () => void;
  textToConfirm: string;
}>;

export default function StrongConfirmDialog({
  open, setOpen, handleYes, children, textToConfirm,
}: StrongConfirmDialogProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  return (
    <ConfirmDialog
      open={open}
      setOpen={setOpen}
      handler={(value) => {
        if (value) handleYes();
      }}
      buttonDisabled={text !== textToConfirm}
    >
      {children}
      <Stack spacing={1}>
        <Typography>
          {t('typeInConfirm').replace('$NAME', textToConfirm)}
        </Typography>
        <TextField value={text} onChange={(e) => { setText(e.target.value); }} />
      </Stack>
    </ConfirmDialog>
  );
}
