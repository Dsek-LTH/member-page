import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  useArticleQuery,
  useRemoveArticleMutation,
  useUpdateArticleMutation,
} from '../../../../generated/graphql';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import ArticleEditor from '~/components/ArticleEditor';
import Paper from '@mui/material/Paper';
import { commonPageStyles } from '~/styles/commonPageStyles';
import { Typography } from '@mui/material';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import routes from '~/routes';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser';
import putFile from '~/functions/putFile';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function EditArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const articleQuery = useArticleQuery({
    variables: { id: id },
  });

  const { user, loading: userLoading } = useContext(UserContext);

  const { t } = useTranslation(['common', 'news']);
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );
  const [body, setBody] = React.useState({ sv: '', en: '' });
  const [header, setHeader] = React.useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [imageName, setImageName] = React.useState('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [updateArticleMutation, articleMutationStatus] =
    useUpdateArticleMutation({
      variables: {
        id: id,
        header: header.sv,
        headerEn: header.en,
        body: body.sv,
        bodyEn: body.en,
        imageName: imageFile ? imageName : undefined,
      },
    });
  const [removeArticleMutation, removeArticleStatus] = useRemoveArticleMutation(
    {
      variables: {
        id: id,
      },
    }
  );
  const apiContext = useApiAccess();

  const updateArticle = async () => {
    let fileType = undefined;
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
      removeArticleMutation()
        .then(() => {
          router.push(routes.root);
        })
        .catch(() => {
          setErrorOpen(true);
        });
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

  useEffect(() => {
    if (!articleMutationStatus.loading && articleMutationStatus.called) {
      if (articleMutationStatus.error) {
        setErrorOpen(true);
        setSuccessOpen(false);
      } else {
        setErrorOpen(false);
        setSuccessOpen(true);
      }
    } else {
      setSuccessOpen(false);
      setErrorOpen(false);
    }
  }, [articleMutationStatus.loading]);

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
    !keycloak?.authenticated ||
    !hasAccess(apiContext, 'news:article:update')
  ) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('news:editArticle')}
        </Typography>

        <SuccessSnackbar
          open={successOpen}
          onClose={setSuccessOpen}
          message={t('edit_saved')}
        />

        <ErrorSnackbar
          open={errorOpen}
          onClose={setErrorOpen}
          message={t('error')}
        />

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
