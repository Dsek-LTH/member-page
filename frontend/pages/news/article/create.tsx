import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser';
import { useCreateArticleMutation } from '../../../generated/graphql';
import ArticleEditor from '~/components/ArticleEditor';
import commonPageStyles from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import putFile from '~/functions/putFile';
import NoTitleLayout from '~/components/NoTitleLayout';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function CreateArticlePage() {
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

  const { user, loading: userLoading } = useContext(UserContext);

  const { t } = useTranslation(['common', 'news']);
  const apiContext = useApiAccess();
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [body, setBody] = useState({ sv: '', en: '' });
  const [header, setHeader] = useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState('');
  const snackbarContext = useSnackbar();

  const [createArticleMutation, { loading }] = useCreateArticleMutation({
    variables: {
      header: header.sv,
      body: body.sv,
      headerEn: header.en,
      bodyEn: body.en,
      imageName,
    },
    onCompleted: () => {
      snackbarContext.showMessage(t('publish_successful'), 'success');
    },
    onError: (error) => {
      console.error(error.message);
      if (error.message.includes('You do not have permission')) {
        snackbarContext.showMessage(t('common:no_permission_action'), 'error');
        return;
      }
      snackbarContext.showMessage(t('error'), 'error');
    },
  });

  const createArticle = async () => {
    let fileType;
    if (imageFile) {
      fileType = await FileType.fromBlob(imageFile);
      setImageName(`public/${uuidv4()}.${fileType.ext}`);
    }

    const { data, errors } = await createArticleMutation();
    if (imageFile) {
      putFile(data.article.create.uploadUrl, imageFile, fileType.mime);
    }
    if (!errors) {
      Router.push('/news');
    }
  };

  if (!initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <ArticleEditorSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  if (!keycloak?.authenticated || !user) {
    return <>{t('notAuthenticated')}</>;
  }

  if (!hasAccess(apiContext, 'event:create')) {
    return (
      <>
        {t('no_permission_page')}
      </>
    );
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('news:createArticle')}
        </Typography>

        <ArticleEditor
          header={header}
          onHeaderChange={setHeader}
          body={body}
          onBodyChange={setBody}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          loading={loading}
          onSubmit={createArticle}
          saveButtonText={t('publish')}
          onImageChange={(file: File) => {
            setImageFile(file);
            setImageName(file.name);
          }}
          imageName={imageName}
        />
      </Paper>
    </NoTitleLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
