import React from 'react';
import { useTranslation } from 'next-i18next';
import {
  Box, FormControlLabel, Stack, Switch, TextField, Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { authorIsUser } from '~/functions/authorFunctions';
import { ArticleToEditQuery } from '~/generated/graphql';
import { useUser } from '~/providers/UserProvider';
import TagSelector from './TagSelector';
import LanguageTabs, { InputProps, TranslationObject } from './LanguageTabs';

type OtherProps = {
  tagIds: string[];
  onTagChange: (updated: string[]) => void;

  loading: boolean;
  removeLoading?: boolean;
  removeArticle?: () => void;

  onSubmit: () => void;
  saveButtonText: string;

  author?: ArticleToEditQuery['article']['author']

  // If one of these is defined, all should be defined
  sendNotification?: boolean;
  onSendNotificationChange?: (value: boolean) => void;
  notificationBody?: TranslationObject;
  onNotificationBodyChange?: (translation: TranslationObject) => void;
};

export type EditorProps = InputProps & OtherProps;

export default function ArticleEditor({
  loading,
  removeLoading,
  onSubmit,
  removeArticle,
  saveButtonText,
  author,
  tagIds,
  onTagChange,
  sendNotification,
  onSendNotificationChange,
  notificationBody,
  onNotificationBodyChange,
  ...props
}: EditorProps) {
  const { t } = useTranslation('common');
  const { t: tNews } = useTranslation('news');
  const apiContext = useApiAccess();

  const { user } = useUser();

  return (
    <Box component="form" noValidate autoComplete="off">
      <LanguageTabs {...props} />
      <Stack spacing={2} mb={8} display="inline-flex" sx={{ minWidth: '50%' }}>
        <TagSelector
          currentlySelected={tagIds}
          onChange={onTagChange}
        />
        {onSendNotificationChange && (
        <Stack>
          <Tooltip title={tNews('sendNotificationTooltip')} placement="right">
            <FormControlLabel
              control={(
                <Switch
                  value={sendNotification}
                  onChange={(e) => onSendNotificationChange(e.target.checked)}
                />
          )}
              sx={{ alignSelf: 'flex-start' }}
              label={tNews('sendNotification') as string}
            />
          </Tooltip>
          {(sendNotification && notificationBody !== undefined && onNotificationBodyChange) && (
            <Tooltip title={tNews('notificationBodyTooltip')}>
              <TextField
                id="notification-field"
                label={tNews('notificationBody')}
                onChange={(event) => onNotificationBodyChange({
                  ...notificationBody,
                  sv: event.target.value,
                })}
                multiline
                value={notificationBody.sv}
                inputProps={{ maxLength: 200 }}
              />
            </Tooltip>
          )}
        </Stack>
        )}
      </Stack>
      <Box>
        <LoadingButton
          style={{ marginRight: '1rem' }}
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={() => {
            onSubmit();
          }}
        >
          {saveButtonText}
        </LoadingButton>
        {removeArticle && (hasAccess(apiContext, 'news:article:delete') || authorIsUser(author, user)) && (
          <LoadingButton
            color="error"
            loading={removeLoading}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            variant="outlined"
            onClick={() => removeArticle()}
          >
            {t('delete')}
          </LoadingButton>
        )}
      </Box>
    </Box>
  );
}
