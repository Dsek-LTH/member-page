import { TabContext, TabPanel } from '@mui/lab';
import {
  Tab, Tabs,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import ArticleEditorItem, { ArticleEditorProps } from './ArticleEditorItem';

export type TranslationObject = {
  sv: string;
  en: string;
};

export type InputProps = {
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  header: TranslationObject;
  body: TranslationObject;
  onHeaderChange: (translation: TranslationObject) => void;
  onBodyChange: (translation: TranslationObject) => void;
} & Omit<ArticleEditorProps, 'header' | 'body' | 'onHeaderChange' | 'onBodyChange'>;

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

export default function LanguageTabs(props: InputProps) {
  const [lang, setLang] = useState('sv');
  const { t } = useTranslation('common');

  return (
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
  );
}
