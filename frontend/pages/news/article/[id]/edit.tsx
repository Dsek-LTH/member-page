import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser';
import {
  useArticleQuery,
  useRemoveArticleMutation,
  useUpdateArticleMutation,
} from '../../../../generated/graphql';
import ArticleEditor from '~/components/ArticleEditor';
import commonPageStyles from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import routes from '~/routes';
import putFile from '~/functions/putFile';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import NoTitleLayout from '~/components/NoTitleLayout';
import { useSnackbar } from '~/providers/SnackbarProvider';

export default function EditArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const articleQuery = useArticleQuery({
    variables: { id },
  });

  const { loading: userLoading } = useContext(UserContext);
  const { showMessage } = useSnackbar();

  const { t } = useTranslation(['common', 'news']);
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write',
  );
  const [body, setBody] = React.useState({ sv: '', en: '' });
  const [header, setHeader] = React.useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [imageName, setImageName] = React.useState('');

  const [updateArticleMutation, articleMutationStatus] = useUpdateArticleMutation({
    variables: {
      id,
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
    },
    onCompleted: () => {
      showMessage(t('edit_saved'), 'success');
    },
    onError: (error) => {
      console.error(error.message);
      if (error.message.includes('You do not have permission')) {
        showMessage(t('common:no_permission_action'), 'error');
        return;
      }
      showMessage(t('error'), 'error');
    },
  });
  const [removeArticleMutation, removeArticleStatus] = useRemoveArticleMutation(
    {
      variables: {
        id,
      },
      onCompleted: () => {
        showMessage(t('edit_saved'), 'success');
        router.push(routes.root);
      },
      onError: (error) => {
        console.error(error.message);
        if (error.message.includes('You do not have permission')) {
          showMessage(t('common:no_permission_action'), 'error');
          return;
        }
        showMessage(t('error'), 'error');
      },
    },
  );
  const apiContext = useApiAccess();

  const updateArticle = async () => {
    let fileType;
    if (imageFile) {
      fileType = await FileType.fromBlob(imageFile);
      setImageName(`public/${uuidv4()}.${fileType.ext}`);
    }

    const data = await updateArticleMutation();
    if (imageFile) {
      putFile(data.data.article.update.uploadUrl, imageFile, fileType.mime);
    }
  };

  const removeArticle = () => {
    if (window.confirm(t('news:areYouSureYouWantToDeleteThisArticle'))) {
      removeArticleMutation();
    }
  };

  useEffect(() => {
    setBody({
      sv: articleQuery.data?.article.body || '',
      en: articleQuery.data?.article.bodyEn || '',
    });
    setHeader({
      sv: articleQuery.data?.article.header || '',
      en: articleQuery.data?.article.headerEn || '',
    });
    setImageName(articleQuery.data?.article?.imageUrl);
  }, [articleQuery.data]);

  if (articleQuery.loading || !initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <ArticleEditorSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  const article = articleQuery.data?.article;

  if (!article) {
    return <NoTitleLayout>{t('articleError')}</NoTitleLayout>;
  }

  if (
    !keycloak?.authenticated
    || !hasAccess(apiContext, 'news:article:update')
  ) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('news:editArticle')}
        </Typography>

        <ArticleEditor
          header={header}
          onHeaderChange={setHeader}
          body={body}
          onBodyChange={setBody}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          loading={articleMutationStatus.loading}
          removeLoading={removeArticleStatus.loading}
          removeArticle={removeArticle}
          onSubmit={updateArticle}
          saveButtonText={t('update')}
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
