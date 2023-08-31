import { Alert, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArticleEditor from '~/components/ArticleEditor';
import { PublishAsOption } from '~/components/ArticleEditor/ArticleEditorItem';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import { articlesPerPage } from '~/components/News/NewsPage';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { getFullName } from '~/functions/memberFunctions';
import putFile from '~/functions/putFile';
import selectTranslation from '~/functions/selectTranslation';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useDialog } from '~/providers/DialogProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useUser } from '~/providers/UserProvider';
import commonPageStyles from '~/styles/commonPageStyles';
import { useCreateArticleMutation, useNewsPageQuery } from '../../../generated/graphql';

export default function CreateArticlePage() {
  const router = useRouter();
  const { t } = useTranslation();
  useSetPageName(t('news:createArticle'));

  const { user, loading: userLoading } = useUser();
  const [publishAs, setPublishAs] = useState<PublishAsOption | undefined>(undefined);
  const [publishAsOptions, setPublishAsOptions] = useState<PublishAsOption[]>([{ id: undefined, label: '', type: 'Member' }]);

  useEffect(() => {
    if (user) {
      const me = { id: undefined, label: getFullName(user), type: 'Member' as const };
      setPublishAsOptions([
        me,
        ...user.mandates.map((mandate) => ({
          id: mandate.id,
          label: `${getFullName(user)}, ${mandate?.position?.name}`,
          type: 'Mandate' as const,
        })),
        ...(user.customAuthorOptions?.map((option) => ({
          id: option.id,
          label: selectTranslation(i18n, option.name, option.nameEn),
          type: 'Custom' as const,
        })) ?? []),
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
  const { confirm } = useDialog();

  const asyncConfirm = async (message: string) => new Promise((resolve) => {
    confirm(message, resolve);
  });
  const { refetch } = useNewsPageQuery({
    variables: { page_number: 1, per_page: articlesPerPage, tagIds: [] },
  });
  const willPublishDirectly = hasAccess(apiContext, 'news:article:manage');

  const [createArticleMutation, { loading }] = useCreateArticleMutation({
    variables: {
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
      author: {
        mandateId: publishAs?.type === 'Mandate' ? publishAs.id : undefined,
        customAuthorId: publishAs?.type === 'Custom' ? publishAs.id : undefined,
      },
      tagIds,
      sendNotification: shouldSendNotification,
      notificationBody: notificationBody.sv,
      notificationBodyEn: notificationBody.en,
    },
    onCompleted: () => {
      showMessage(t(willPublishDirectly ? 'publish_successful' : 'news:request_successful'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });

  const createArticle = async () => {
    // Warnings
    if (!header.sv && !await asyncConfirm(t('news:create.warning.noSwedishHeader'))) return;
    if (!header.en && !await asyncConfirm(t('news:create.warning.noEnglishHeader'))) return;
    if (!body.sv && !body.en && !await asyncConfirm(t('news:create.warning.noBody'))) return;
    if (((body.sv && !body.en) || (!body.sv && body.en)) && !await asyncConfirm(t('news:create.warning.missingBodyTranslation'))) return;
    if (shouldSendNotification && (!notificationBody.sv && !notificationBody.en) && !await asyncConfirm(t('news:create.warning.noNotificationText'))) return;
    if (tagIds.length === 0 && !await asyncConfirm(t('news:create.warning.noTags'))) return;
    if (shouldSendNotification && tagIds.length === 0 && !await asyncConfirm(t('news:create.warning.noTagsOnNotification'))) return;

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
        {!willPublishDirectly && (
        <Alert severity="info" sx={{ my: 2 }}>
          {t('news:createRequestInfo')}
        </Alert>
        )}

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
          setPublishAs={setPublishAs}
          publishAs={publishAs}
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
