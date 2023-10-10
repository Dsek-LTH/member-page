import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Tab, Tabs } from '@mui/material';
import { TabContext } from '@mui/lab';
import ReactMde from 'react-mde';
import { useUpdateMarkdownMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import Markdown from './Markdown';

export default function MarkdownPage({
  data,
}: {
  data: {
    name: string;
    markdown: string;
    markdown_en: string;
  };
}) {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [bodySv, setBodySv] = useState(data.markdown);
  const [bodyEn, setBodyEn] = useState(data.markdown_en);
  const [updateMarkdownMutation] = useUpdateMarkdownMutation({
    variables: {
      name: data?.name,
      markdown: bodySv,
      markdown_en: bodyEn,
    },
  });
  const [selectedTab, setSelectedTab] = useState<'preview' | 'write'>(
    'preview',
  );
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();

  useEffect(() => {
    setBodySv(data?.markdown);
    setBodyEn(data?.markdown_en);
  }, [data]);

  return (
    <div>
      {hasAccess(`markdowns:${data.name}:update`) ? (
        <>
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
          </TabContext>
          <ReactMde
            value={lang === 'sv' ? bodySv : bodyEn}
            onChange={lang === 'sv' ? setBodySv : setBodyEn}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            l18n={{
              write: t('news:write'),
              preview: t('news:preview'),
              uploadingImage: t('news:uploadingImage'),
              pasteDropSelect: t('news:pasteDropSelect'),
            }}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(<Markdown content={markdown} />)}
          />
          <Button
            variant="outlined"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              updateMarkdownMutation()
                .then(() => {
                  showMessage(t('edit_saved'), 'success');
                })
                .catch(() => {
                  showMessage(t('error'), 'error');
                });
            }}
          >
            Uppdatera
          </Button>
        </>
      ) : (
        <Markdown content={lang === 'sv' ? bodySv : bodyEn} />
      )}
    </div>
  );
}
