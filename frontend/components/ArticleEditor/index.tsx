import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import {
  Box, FormControlLabel, Stack, Switch, Tab, Tabs, TextField, Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton, TabContext, TabPanel } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleEditorItem from './ArticleEditorItem';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { authorIsUser } from '~/functions/authorFunctions';
import { ArticleToEditQuery } from '~/generated/graphql';
import { useUser } from '~/providers/UserProvider';
import TagSelector from './TagSelector';

type TranslationObject = {
  sv: string;
  en: string;
};

type InputProps = {
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  header: TranslationObject;
  body: TranslationObject;
  onHeaderChange: (translation: TranslationObject) => void;
  onBodyChange: (translation: TranslationObject) => void;
  imageName: string;
  onImageChange: (file: File) => void;
  mandateId: string;
  setMandateId: (value) => void;
  publishAsOptions: { id: string; label: string }[];
};

type EditorProps = InputProps & {
  tagIds: string[];
  sendNotification?: boolean;
  notificationBody: TranslationObject;
  onTagChange: (updated: string[]) => void;
  onSendNotificationChange?: (value: boolean) => void;
  onNotificationBodyChange: (translation: TranslationObject) => void;

  loading: boolean;
  removeLoading?: boolean;
  removeArticle?: () => void;

  onSubmit: () => void;
  saveButtonText: string;

  author?: ArticleToEditQuery['article']['author']
};

// One editor for a specific language
function LanguageTab({
  lang, header, body, onHeaderChange, onBodyChange, ...props
}: {
  lang: 'sv' | 'en';
} & InputProps) {
  return (
    <TabPanel value={lang} style={{ padding: '24px 0' }}>
      <ArticleEditorItem
        {...props}
        header={header[lang]}
        body={body[lang]}
        onHeaderChange={(value) =>
          onHeaderChange({
            ...header,
            [lang]: value,
          })}
        onBodyChange={(value) =>
          onBodyChange({
            ...body,
            [lang]: value,
          })}
      />
    </TabPanel>
  );
}

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

  const [lang, setLang] = React.useState('sv');

  const { user } = useUser();

  return (
    <Box component="form" noValidate autoComplete="off">
      <TabContext value={lang}>
        <Tabs
          value={lang}
          onChange={(_, newTab) => setLang(newTab)}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value="sv" label={t('swedish')} />
          <Tab value="en" label={t('english')} />
        </Tabs>
        <LanguageTab lang="sv" {...props} />
        <LanguageTab lang="en" {...props} />
      </TabContext>
      <Stack spacing={2} mb={8} display="inline-flex" sx={{ minWidth: '50%' }}>
        <TagSelector
          currentlySelected={tagIds}
          onChange={onTagChange}
        />
        {onSendNotificationChange && tagIds.length > 0 && (
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
          {sendNotification && (
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
