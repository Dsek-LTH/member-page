import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Button, Tab, Tabs,
} from '@mui/material';
import { TabContext } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import { useGetMarkdownQuery, useUpdateMarkdownMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import Markdown from './Markdown';
import MarkdownEditor from './MarkdownEditor';

export default function MarkdownPage({ name }) {
  const [editing, setEditing] = useState(false);
  const { data } = useGetMarkdownQuery({ variables: { name } });
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [bodySv, setBodySv] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [updateMarkdownMutation] = useUpdateMarkdownMutation({
    variables: {
      name,
      markdown: bodySv,
      markdown_en: bodyEn,
    },
  });
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();

  const onBodyChange = (value) => {
    if (lang === 'sv') {
      setBodySv(value);
    } else {
      setBodyEn(value);
    }
  };

  useEffect(() => {
    setBodySv(data?.markdown?.markdown);
    setBodyEn(data?.markdown?.markdown_en);
  }, [data]);

  return (
    <div>
      {(hasAccess(`markdowns:${name}:update`) && editing)
        ? (
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
            <MarkdownEditor
              body={lang === 'sv' ? bodySv : bodyEn}
              onBodyChange={onBodyChange}
              header={name}
            />
            <Button
              variant="outlined"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                updateMarkdownMutation().then(() => {
                  showMessage(t('edit_saved'), 'success');
                  setEditing(false);
                })
                  .catch(() => {
                    showMessage(t('error'), 'error');
                  });
              }}
            >
              {t('save')}
            </Button>
          </>
        )
        : <Markdown content={lang === 'sv' ? bodySv : bodyEn} />}
      {(hasAccess(`markdowns:${name}:update`) && !editing) && (
        <Button
          aria-label="edit"
          onClick={() => setEditing(true)}
        >
          <EditIcon
            color="primary"
            style={{
              marginRight: '0.5rem',
            }}
          />
          {t('edit')}
        </Button>

      )}
    </div>
  );
}
