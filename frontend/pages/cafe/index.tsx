import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Button } from '@mui/material';
import ReactMde from 'react-mde';
import { useGetMarkdownQuery, useUpdateMarkdownMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useApiAccess } from '~/providers/ApiAccessProvider';

export default function CafePage() {
  const { data } = useGetMarkdownQuery({ variables: { name: 'cafe' } });
  const [body, setBody] = useState('');
  const [updateMarkdownMutation] = useUpdateMarkdownMutation({
    variables: {
      name: 'cafe',
      markdown: body,
    },
  });
  const [selectedTab, setSelectedTab] = useState<'preview' | 'write'>('preview');
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();
  useEffect(() => {
    setBody(data?.markdown?.markdown);
  }, [data]);
  return (
    <>
      <h2>{t('cafe')}</h2>
      {hasAccess('markdowns:update')
        ? (
          <>
            <ReactMde
              value={body}
              onChange={setBody}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              l18n={{
                write: t('news:write'),
                preview: t('news:preview'),
                uploadingImage: t('news:uploadingImage'),
                pasteDropSelect: t('news:pasteDropSelect'),
              }}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
            />
            <Button
              variant="outlined"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                updateMarkdownMutation().then(() => {
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
        )
        : <ReactMarkdown>{body}</ReactMarkdown>}

    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
