import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useArticleQuery, useRemoveArticleMutation, useUpdateArticleMutation } from '../../../../generated/graphql';
import { useRouter } from 'next/router'
import ArticleLayout from '../../../../layouts/articleLayout';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import ArticleEditor from '~/components/ArticleEditor';
import Paper from '@material-ui/core/Paper';
import { commonPageStyles } from '~/styles/commonPageStyles'
import { articleEditorPageStyles } from '~/styles/articleEditorPageStyles'
import { Typography } from '@material-ui/core';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import { LoadingButton } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import routes from '~/routes';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser'
import putFile from '~/functions/putFile';

export default function EditArticlePage() {
  const router = useRouter()
  const id = router.query.id as string;
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const articleQuery = useArticleQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 }
  });

  const { user, loading: userLoading } = useContext(UserContext);

  const { t } = useTranslation(['common', 'news']);
  const articlePageClasses = articleEditorPageStyles();
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>('write');
  const [body, setBody] = React.useState({ sv: "", en: "" });
  const [header, setHeader] = React.useState({ sv: "", en: "" });
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [imageName, setImageName] = React.useState('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [updateArticleMutation, articleMutationStatus] = useUpdateArticleMutation({
    variables: {
      id: Number.parseInt(id),
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined
    }
  })
  const [removeArticle, removeArticleStatus] = useRemoveArticleMutation({
    variables: {
      id: Number.parseInt(id)
    }
  })

  const updateArticle = async () => {
    let fileType = undefined;
    if(imageFile){
      fileType = await FileType.fromBlob(imageFile);
      setImageName(`public/${uuidv4()}.${fileType.ext}`);
    }

    const data = await updateArticleMutation();
    if(imageFile){
      putFile(data.data.article.update.uploadUrl, imageFile, fileType.mime);
    }
  }

  useEffect(() => {
    setBody({
      sv: articleQuery.data?.article.body || "",
      en: articleQuery.data?.article.bodyEn || "",
    })
    setHeader({
      sv: articleQuery.data?.article.header || "",
      en: articleQuery.data?.article.headerEn || "",
    })
    setImageName(articleQuery.data?.article?.imageUrl)
  }, [articleQuery.data]);

  useEffect(() => {
    if (!articleMutationStatus.loading && articleMutationStatus.called) {
      if (articleMutationStatus.error) {
        setErrorOpen(true);
        setSuccessOpen(false);
      }
      else {
        setErrorOpen(false);
        setSuccessOpen(true);
      }
    }
    else {
      setSuccessOpen(false);
      setErrorOpen(false);
    }

  }, [articleMutationStatus.loading]);


  if (articleQuery.loading || !initialized || userLoading) {
    return (
      <ArticleLayout>
        <Paper className={classes.innerContainer}>
          <ArticleEditorSkeleton />
        </Paper>
      </ArticleLayout>
    )
  }

  const article = articleQuery.data?.article;

  if (!article) {
    return (
      <ArticleLayout>
        {t('articleError')}
      </ArticleLayout>
    );
  }

  if (!keycloak?.authenticated || user?.id !== article.author.id) {
    return (
      <ArticleLayout>
        {t('notAuthenticated')}
      </ArticleLayout>
    );
  }

  return (
    <ArticleLayout>
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
          onSubmit={updateArticle}
          saveButtonText={t('update')}
          onImageChange={(file: File) => {
            setImageFile(file)
            setImageName(file.name)
          }}
          imageName={imageName}
        />
        <LoadingButton
          loading={removeArticleStatus.loading}
          loadingPosition="start"
          startIcon={<DeleteIcon />}
          variant="outlined"
          onClick={() => {
            if (window.confirm(t('news:areYouSureYouWantToDeleteThisArticle'))) {
              removeArticle().then(() => {
                router.push(routes.root)
              }).catch(() => {
                setErrorOpen(true);
              })
            }
          }}
          className={articlePageClasses.removeButton}
        >
          {t('delete')}
        </LoadingButton>
      </Paper>
    </ArticleLayout >
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'news']),
    }
  }
}