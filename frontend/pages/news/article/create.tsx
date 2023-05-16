import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArticleEditor from '~/components/ArticleEditor';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { getFullName } from '~/functions/memberFunctions';
import putFile from '~/functions/putFile';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useUser } from '~/providers/UserProvider';
import commonPageStyles from '~/styles/commonPageStyles';
import { useCreateArticleMutation, useNewsPageQuery } from '../../../generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';
import { articlesPerPage } from '~/components/News/NewsPage';

export default function CreateArticlePage() {
  const router = useRouter();
  const { t } = useTranslation();
  useSetPageName(t('news:createArticle'));

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
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [shouldSendNotification, setShouldSendNotification] = useState(false);
  const [notificationBody, setNotificationBody] = useState({ sv: '', en: '' });
  const { showMessage } = useSnackbar();
  const { refetch } = useNewsPageQuery({
    variables: { page_number: 1, per_page: articlesPerPage, tagIds: [] },
  });

  const [createArticleMutation, { loading }] = useCreateArticleMutation({
    variables: {
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
      mandateId: mandateId !== 'none' ? mandateId : undefined,
      tagIds,
      sendNotification: shouldSendNotification,
      notificationBody: notificationBody.sv,
      notificationBodyEn: notificationBody.en,
    },
    onCompleted: () => {
      showMessage(t('publish_successful'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });

  const createArticle = async () => {
    if (imageFile) {
      setImageName(`public/${uuidv4()}.${imageFile.name.split('.').pop()}`);
    }

    const { data, errors } = await createArticleMutation();
    if (imageFile) {
      putFile(
        data.article.create.uploadUrl,
        imageFile,
        imageFile.type,
        showMessage,
        t,
      );
    }
    if (!errors) {
      await refetch();
      router.push('/news');
    }
  };

  if (userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <ArticleEditorSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  if (!user) {
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
          tagIds={tagIds}
          onTagChange={setTagIds}
          sendNotification={shouldSendNotification}
          onSendNotificationChange={setShouldSendNotification}
          notificationBody={notificationBody}
          onNotificationBodyChange={setNotificationBody}
        />
      </Paper>
    </NoTitleLayout>
  );
}

export const getStaticProps = genGetProps(['news']);
