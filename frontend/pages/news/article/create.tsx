import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router from 'next/router';
import { useCreateArticleMutation } from '../../../generated/graphql';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import ArticleEditor from '~/components/ArticleEditor';
import Paper from '@mui/material/Paper';
import { commonPageStyles } from '~/styles/commonPageStyles';
import { Typography } from '@mui/material';
import UserContext from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import putFile from '~/functions/putFile';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser';

export default function CreateArticlePage() {
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

  const { user, loading: userLoading } = useContext(UserContext);

  const { t } = useTranslation(['common', 'news']);
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [body, setBody] = useState({ sv: '', en: '' });
  const [header, setHeader] = useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [createArticleMutation, { data, loading, error, called }] =
    useCreateArticleMutation({
      variables: {
        header: header.sv,
        body: body.sv,
        headerEn: header.en,
        bodyEn: body.en,
        imageName: imageName,
      },
    });

  const createArticle = async () => {
    let fileType = undefined;
    if (imageFile) {
      fileType = await FileType.fromBlob(imageFile);
      setImageName(`public/${uuidv4()}.${fileType.ext}`);
    }

    const data = await createArticleMutation();
    if (imageFile) {
      putFile(data.data.article.create.uploadUrl, imageFile, fileType.mime);
    }
    if (!data.errors) {
      Router.push('/news');
    }
  };

  useEffect(() => {
    if (!loading && called) {
      if (error) {
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
  }, [loading]);

  if (!initialized || userLoading) {
    return (
      <Paper className={classes.innerContainer}>
        <ArticleEditorSkeleton />
      </Paper>
    );
  }

  if (!keycloak?.authenticated || !user) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <Paper className={classes.innerContainer}>
      <Typography variant="h3" component="h1">
        {t('news:createArticle')}
      </Typography>

      <SuccessSnackbar
        open={successOpen}
        onClose={setSuccessOpen}
        message={t('publish_successful')}
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
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
