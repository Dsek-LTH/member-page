import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useArticleQuery, useUpdateArticleMutation } from '../../../../generated/graphql';
import { useRouter } from 'next/router'
import ArticleLayout from '../../../../layouts/articleLayout';
import ArticleSkeleton from '../../../../components/News/articleSkeleton';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import ArticleEditor from '~/components/ArticleEditor';
import Paper from '@material-ui/core/Paper';
import articleEditorPageStyles from '~/styles/articleEditorPageStyles'
import { Alert, Collapse, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import UserContext from '~/providers/UserProvider';

export default function EditArticlePage() {
  const router = useRouter()
  const id = router.query.id as string;
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const articleQuery = useArticleQuery({
    variables: { id: parseInt(id) ? parseInt(id) : 0 }
  });

  const {user, loading: userLoading} = useContext(UserContext);

  const { t } = useTranslation(['common', 'news']);
  const classes = articleEditorPageStyles();

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>('write');
  const [body, setBody] = React.useState({sv: "", en: ""});
  const [header, setHeader] = React.useState({sv: "", en: ""});
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [updateArticle, articleMutationStatus] = useUpdateArticleMutation({
    variables: {
      id: Number.parseInt(id),
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en
    }
  })

  useEffect(() => {
    setBody({
      sv: articleQuery.data?.article.body || "",
      en:  articleQuery.data?.article.body_en || "",
    })
    setHeader({
      sv: articleQuery.data?.article.header || "",
      en:  articleQuery.data?.article.header_en || "",
    })
  }, [articleQuery.data]);

  useEffect(() =>  {
    if(!articleMutationStatus.loading && articleMutationStatus.called){
      if(articleMutationStatus.error){
        setErrorOpen(true);
        setSuccessOpen(false);
      }
      else{
        setErrorOpen(false);
        setSuccessOpen(true);
      }
    }
    else
    {
      setSuccessOpen(false);
      setErrorOpen(false);
    }
   
  }, [articleMutationStatus.loading]);


  if (articleQuery.loading || !initialized || userLoading) {
    return (
      <ArticleLayout>
        <ArticleSkeleton />
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
      <Paper className={classes.container}>
        <Typography variant="h3"  component="h1">
        {t('news:editArticle')}
        </Typography>

        <Collapse in={successOpen}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccessOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {t('news:edit_saved')}
        </Alert>
        </Collapse>

        <Collapse in={errorOpen}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {t('error')}
        </Alert>
        </Collapse>

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
        />
      </Paper>
    </ArticleLayout >
  )
}

export async function getServerSideProps ({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'news']),
    }
  }
}