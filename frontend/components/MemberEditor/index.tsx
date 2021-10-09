import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { Box, Stack, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { MutationFunctionOptions } from '@apollo/client';
import { memberEditorStyles } from './memberEditorStyles';

type MemberEditorProps = {
  firstName: string;
  lastName: string;
  nickname: string;
  classProgramme: string;
  classYear: number;
  picturePath: string;
  loading: boolean;
  onFirstNameChange: (string: string) => void;
  onLastNameChange: (string: string) => void;
  onNicknameChange: (string: string) => void;
  onClassProgrammeChange: (string: string) => void;
  onClassYearChange: (number: number) => void;
  onPicturePathChange: (string: string) => void;
  onSubmit: (options?: MutationFunctionOptions) => void;
};

export default function MemberEditor({
  firstName,
  lastName,
  nickname,
  classProgramme,
  classYear,
  picturePath,
  loading,
  onFirstNameChange,
  onLastNameChange,
  onNicknameChange,
  onClassProgrammeChange,
  onClassYearChange,
  onPicturePathChange,
  onSubmit,
}: MemberEditorProps) {
  const classes = memberEditorStyles();
  const { t } = useTranslation(['common', 'member']);

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack spacing={2} className={classes.stack}>
        <TextField
          id="header-field"
          label={t('member:firstName')}
          onChange={(value) => onFirstNameChange(value.target.value)}
          multiline
          value={firstName}
        />
        <TextField
          id="header-field"
          label={t('member:lastName')}
          onChange={(value) => onLastNameChange(value.target.value)}
          multiline
          value={lastName}
        />
        <TextField
          id="header-field"
          label={t('member:nickname')}
          onChange={(value) => onNicknameChange(value.target.value)}
          multiline
          value={nickname}
        />
        <TextField
          id="header-field"
          label={t('member:classProgramme')}
          onChange={(value) => onClassProgrammeChange(value.target.value)}
          multiline
          value={classProgramme}
        />
        <TextField
          id="header-field"
          label={t('member:classYear')}
          onChange={(value) =>
            onClassYearChange(Number.parseInt(value.target.value) || classYear)
          }
          value={classYear}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </Stack>
      <LoadingButton
        loading={loading}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="outlined"
        className={classes.updateButton}
        onClick={() => {
          onSubmit();
        }}
      >
        {t('update')}
      </LoadingButton>
    </Box>
  );
}
