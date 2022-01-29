import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import * as FileType from 'file-type/browser';
import { useCreateArticleMutation } from '../../../generated/graphql';
import ArticleEditor from '~/components/ArticleEditor';
import commonPageStyles from '~/styles/commonPageStyles';
import { useUser } from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import putFile from '~/functions/putFile';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import NoTitleLayout from '~/components/NoTitleLayout';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import { getFullName } from '~/functions/memberFunctions';

export default function CreateArticlePage() {
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { t } = useTranslation();

  const { user, loading: userLoading } = useUser();
  const [mandateId, setMandateId] = useState('none');
  const [publishAsOptions, setPublishAsOptions] = useState<
    { id: string; label: string }[]
  >([{ id: 'none', label: '' }]);

  useEffect(() => {
    if (user) {
      const me = { id: 'none', label: getFullName(user) };
      setPublishAsOptions([
        me,
        ...user.mandates.map((mandate) => ({
          id: mandate.id,
          label: `${getFullName(user)}, ${mandate.position.name}`,
        })),
      ]);
    }
  }, [user]);

  const apiContext = useApiAccess();
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [body, setBody] = useState({ sv: '', en: '' });
  const [header, setHeader] = useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState('');
  const { showMessage } = useSnackbar();

  const [createArticleMutation, { loading }] = useCreateArticleMutation({
    variables: {
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
      mandateId: mandateId !== 'none' ? mandateId : undefined,
    },
    onCompleted: () => {
      showMessage(t('publish_successful'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t);
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
      putFile(
        data.article.create.uploadUrl,
        imageFile,
        fileType.mime,
        showMessage,
        t,
      );
    }
    if (!errors) {
      router.push('/news');
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
    return <NoTitleLayout>{t('notAuthenticated')}</NoTitleLayout>;
  }

  if (!hasAccess(apiContext, 'news:article:create')) {
    return <>{t('no_permission_page')}</>;
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
          publishAsOptions={publishAsOptions}
          mandateId={mandateId}
          setMandateId={setMandateId}
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
