import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import {
  Box, FormControlLabel, Stack, Switch, Tab, Tabs,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton, TabContext, TabPanel } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleEditorItem from './ArticleEditorItem';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { authorIsUser } from '~/functions/authorFunctions';
import { ArticleToEditQuery, useGetTagsQuery } from '~/generated/graphql';
import { useUser } from '~/providers/UserProvider';
import TagSelector from './TagSelector';

type translationObject = {
  sv: string;
  en: string;
};

type EditorProps = {
  header: translationObject;
  onHeaderChange: (translation: translationObject) => void;
  body: translationObject;
  onBodyChange: (translation: translationObject) => void;
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  onImageChange: (file: File) => void;
  imageName: string;
  loading: boolean;
  removeLoading?: boolean;
  removeArticle?: () => void;
  onSubmit: () => void;
  saveButtonText: string;
  publishAsOptions: { id: string; label: string }[];
  mandateId: string;
  setMandateId: (value) => void;
  author?: ArticleToEditQuery['article']['author']
  tagIds: string[];
  onTagChange: (updated: string[]) => void;
  sendNotification?: boolean;
  onSendNotificationChange?: (value: boolean) => void;
};

export default function ArticleEditor({
  header,
  onHeaderChange,
  body,
  onBodyChange,
  selectedTab,
  onTabChange,
  onImageChange,
  imageName,
  loading,
  removeLoading,
  onSubmit,
  removeArticle,
  saveButtonText,
  publishAsOptions,
  mandateId,
  setMandateId,
  author,
  tagIds,
  onTagChange,
  sendNotification,
  onSendNotificationChange,
}: EditorProps) {
  const { t } = useTranslation('common');
  const { t: tNews } = useTranslation('news');
  const apiContext = useApiAccess();

  const { data: allTags, loading: tagsLoading } = useGetTagsQuery();

  const handleHeaderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    tag: string,
  ) => {
    onHeaderChange({
      ...header,
      [tag]: event.target.value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(event.target.files[0]);
  };

  const handleBodyChange = (translation: string, languageTag: string) => {
    onBodyChange({
      ...body,
      [languageTag]: translation,
    });
  };

  const [value, setValue] = React.useState('sv');

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setValue(newTab);
  };

  const { user } = useUser();

  return (
    <Box component="form" noValidate autoComplete="off">
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value="sv" label={t('swedish')} />
          <Tab value="en" label={t('english')} />
        </Tabs>

        <TabPanel value="sv" style={{ padding: '24px 0' }}>
          <ArticleEditorItem
            header={header.sv}
            body={body.sv}
            selectedTab={selectedTab}
            onTabChange={onTabChange}
            onHeaderChange={(event) => handleHeaderChange(event, 'sv')}
            onBodyChange={(translation) => handleBodyChange(translation, 'sv')}
            onImageChange={handleImageChange}
            imageName={imageName}
            publishAsOptions={publishAsOptions}
            mandateId={mandateId}
            setMandateId={setMandateId}
          />
        </TabPanel>
        <TabPanel value="en" style={{ padding: '24px 0' }}>
          <ArticleEditorItem
            header={header.en}
            body={body.en}
            selectedTab={selectedTab}
            onTabChange={onTabChange}
            onHeaderChange={(event) => handleHeaderChange(event, 'en')}
            onBodyChange={(translation) => handleBodyChange(translation, 'en')}
            onImageChange={handleImageChange}
            imageName={imageName}
            publishAsOptions={publishAsOptions}
            mandateId={mandateId}
            setMandateId={setMandateId}
          />
        </TabPanel>
      </TabContext>
      <Stack spacing={2} mb={8} display="inline-flex" sx={{ minWidth: '50%' }}>
        {onSendNotificationChange
      && (
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
      )}
        <TagSelector
          tags={tagsLoading ? [] : allTags.tags}
          currentlySelected={tagIds}
          onChange={onTagChange}
        />
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
