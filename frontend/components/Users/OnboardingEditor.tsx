import React from 'react';
import { useTranslation } from 'next-i18next';
import {
  Autocomplete, Box, Stack, TextField, Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { MutationFunctionOptions } from '@apollo/client';
import onboardingEditorStyles from './onboardingEditorStyles';
import programmes from '~/data/programmes';
import getListOfYearsSinceLTHFounding from '~/functions/getListOfYearsSinceLTHFounding';

type OnboardingEditorProps = {
  firstName: string,
  lastName: string,
  classProgramme: string,
  classYear: string,
  foodPreference: string,
  loading: boolean,
  onFirstNameChange: (string: string) => void,
  onLastNameChange: (string: string) => void,
  onClassProgrammeChange: (string: string) => void,
  onClassYearChange: (year: string) => void,
  onFoodPreferenceChange: (string: string) => void,
  onSubmit: (options?: MutationFunctionOptions) => void
};

export default function OnboardingEditor({
  firstName,
  lastName,
  classProgramme,
  classYear,
  foodPreference,
  loading,
  onFirstNameChange,
  onLastNameChange,
  onClassProgrammeChange,
  onClassYearChange,
  onFoodPreferenceChange,
  onSubmit,
}: OnboardingEditorProps) {
  const classes = onboardingEditorStyles();
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
          value={firstName || ''}
        />
        <TextField
          id="header-field"
          label={t('member:lastName')}
          onChange={(value) => onLastNameChange(value.target.value)}
          value={lastName || ''}
        />
        <Stack>
          <Typography>{t('common:food_preference_examples')}</Typography>
          <TextField
            id="header-field"
            label={t('common:food_preference')}
            onChange={(value) => onFoodPreferenceChange(value.target.value)}
            value={foodPreference || ''}
          />
        </Stack>
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
        {t('save')}
      </LoadingButton>
    </Box>
  );
}
