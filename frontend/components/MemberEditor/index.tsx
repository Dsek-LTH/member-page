import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import {
  Autocomplete, Box, Stack, TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { MutationFunctionOptions } from '@apollo/client';
import memberEditorStyles from './memberEditorStyles';
import programmes from '~/data/programmes';
import getListOfYearsSinceLTHFounding from '~/functions/getListOfYearsSinceLTHFounding';

type MemberEditorProps = {
    firstName: string,
    lastName: string,
    nickname: string,
    classProgramme: string,
    classYear: string,
    picturePath: string,
    loading: boolean,
    onFirstNameChange: (string: string) => void,
    onLastNameChange: (string: string) => void,
    onNicknameChange: (string: string) => void,
    onClassProgrammeChange: (string: string) => void,
    onClassYearChange: (number: string) => void,
    onPicturePathChange: (string: string) => void,
    onSubmit: (options?: MutationFunctionOptions) => void
}

export default function MemberEditor({
  firstName,
  lastName,
  nickname,
  classProgramme,
  classYear,
  loading,
  onFirstNameChange,
  onLastNameChange,
  onNicknameChange,
  onClassProgrammeChange,
  onClassYearChange,
  onSubmit,
}: MemberEditorProps) {
  const classes = memberEditorStyles();
  const { t } = useTranslation(['common', 'member']);

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <Stack spacing={2} className={classes.stack}>
        <TextField
          id="header-field"
          label={t('member:firstName')}
          onChange={(value) => onFirstNameChange(value.target.value)}
          value={firstName}
        />
        <TextField
          id="header-field"
          label={t('member:lastName')}
          onChange={(value) => onLastNameChange(value.target.value)}
          value={lastName}
        />
        <TextField
          id="header-field"
          label={t('member:nickname')}
          onChange={(value) => onNicknameChange(value.target.value)}
          value={nickname}
        />
        <Autocomplete
          disablePortal
          id="header-field-auto"
          options={programmes}
          onChange={(event, value) => onClassProgrammeChange(value)}
          value={classProgramme || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              id="header-field"
              label={t('member:classProgramme')}
            />
          )}
        />
        <Autocomplete
          disablePortal
          id="header-field-year-auto"
          options={getListOfYearsSinceLTHFounding()}
          onChange={(event, value) => onClassYearChange(value)}
          value={classYear || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              id="header-field-year"
              label={t('member:classYear')}
            />
          )}
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
