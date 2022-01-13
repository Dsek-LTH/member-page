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
  useArticleForEditQuery,
  useRemoveArticleMutation,
  useUpdateArticleMutation,
} from '../../../../generated/graphql';
import ArticleEditor from '~/components/ArticleEditor';
import commonPageStyles from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import routes from '~/routes';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import putFile from '~/functions/putFile';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function EditArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { data: queryData, loading: queryLoading } = useArticleForEditQuery({
    variables: { id },
  });

  const { loading: userLoading } = useContext(UserContext);

  const { t } = useTranslation(['common', 'news']);
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write',
  );
  const [body, setBody] = React.useState({ sv: '', en: '' });
  const [header, setHeader] = React.useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [imageName, setImageName] = React.useState('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [updateArticleMutation, articleMutationStatus] = useUpdateArticleMutation({
    variables: {
      id,
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
        id,
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
    console.log(queryData);
    console.log(header);
    console.log(body);
    console.log(imageFile);

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
      sv: queryData?.sv.body || '',
      en: queryData?.en.body || '',
    });
    setHeader({
      sv: queryData?.sv.header || '',
      en: queryData?.en.header || '',
    });
    setImageName(queryData?.sv?.imageUrl);
  }, [queryData]);

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
  }, [articleMutationStatus.called, articleMutationStatus.error, articleMutationStatus.loading]);

  if (queryLoading || !initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <ArticleEditorSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  if (!queryData.sv) {
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
