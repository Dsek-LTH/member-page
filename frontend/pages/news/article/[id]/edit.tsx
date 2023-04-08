import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArticleEditor from '~/components/ArticleEditor';
import ArticleEditorSkeleton from '~/components/ArticleEditor/ArticleEditorSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import { authorIsUser } from '~/functions/authorFunctions';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { getFullName } from '~/functions/memberFunctions';
import putFile from '~/functions/putFile';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useDialog } from '~/providers/DialogProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';
import
{
  Member,
  useArticleToEditQuery,
  useNewsPageQuery,
  useRemoveArticleMutation,
  useUpdateArticleMutation,
} from '../../../../generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';
import { articlesPerPage } from '~/components/News/NewsPage';

export default function EditArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const articleQuery = useArticleToEditQuery({
    variables: { id },
  });

  const { loading: userLoading, user } = useUser();
  const [mandateId, setMandateId] = useState('none');
  const [publishAsOptions, setPublishAsOptions] = useState<
  { id: string; label: string }[]
  >([{ id: 'none', label: '' }]);

  useEffect(() => {
    if (articleQuery?.data?.article?.author) {
      const { author } = articleQuery.data.article;
      let member;
      let defaultMandateId = 'none';
      if (author.__typename === 'Member') {
        member = author as Member;
      }
      if (author.__typename === 'Mandate') {
        member = author.member as Member;
        defaultMandateId = author.id;
      }
      setMandateId(defaultMandateId);
      setPublishAsOptions([
        { id: 'none', label: getFullName(member) },
        ...member.mandates.map((mandate) => ({
          id: mandate.id,
          label: `${getFullName(member)}, ${mandate.position.name}`,
        })),
      ]);
    }
  }, [articleQuery?.data?.article]);

  const { confirm } = useDialog();
  const { showMessage } = useSnackbar();
  const { refetch } = useNewsPageQuery({
    variables: { page_number: 1, per_page: articlesPerPage, tagIds: [] },
  });
  const { t } = useTranslation();
  useSetPageName(t('news:editArticle'));
  const classes = commonPageStyles();

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write',
  );
  const [body, setBody] = React.useState({ sv: '', en: '' });
  const [header, setHeader] = React.useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [imageName, setImageName] = React.useState('');
  const [tagIds, setTagIds] = React.useState(
    articleQuery?.data?.article?.tags?.map((tag) => tag.id) ?? [],
  );

  const [updateArticleMutation, articleMutationStatus] = useUpdateArticleMutation({
    variables: {
      id,
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
      mandateId: mandateId !== 'none' ? mandateId : undefined,
      tagIds,
    },
    onCompleted: () => {
      showMessage(t('edit_saved'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });

  const [removeArticleMutation, removeArticleStatus] = useRemoveArticleMutation(
    {
      variables: {
        id,
      },
      onCompleted: async () => {
        showMessage(t('edit_saved'), 'success');
        await refetch();
        router.push(routes.news);
      },
      onError: (error) => {
        handleApolloError(error, showMessage, t);
      },
    },
  );
  const apiContext = useApiAccess();

  const updateArticle = async () => {
    if (imageFile) {
      setImageName(`public/${uuidv4()}.${imageFile.name.split('.').pop()}`);
    }

    const data = await updateArticleMutation();
    if (imageFile) {
      putFile(
        data.data.article.update.uploadUrl,
        imageFile,
        imageFile.type,
        showMessage,
        t,
      );
    }
    articleQuery.refetch();
  };

  const removeArticle = () => {
    confirm(t('news:confirm_delete'), (value) => {
      if (value) removeArticleMutation();
    });
  };

  useEffect(() => {
    setBody({
      sv: articleQuery.data?.article?.body || '',
      en: articleQuery.data?.article?.bodyEn || '',
    });
    setHeader({
      sv: articleQuery.data?.article?.header || '',
      en: articleQuery.data?.article?.headerEn || '',
    });
    setImageName(articleQuery.data?.article?.imageUrl);
    setTagIds(articleQuery.data?.article?.tags?.map((tag) => tag.id) ?? []);
  }, [articleQuery.data]);

  if (articleQuery.loading || userLoading) {
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
    return <NoTitleLayout>{t('news:articleError.missing')}</NoTitleLayout>;
  }

  if (
    !user
   && !hasAccess(apiContext, 'news:article:update') && !authorIsUser(article.author, user)

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
          publishAsOptions={publishAsOptions}
          mandateId={mandateId}
          setMandateId={setMandateId}
          author={article.author}
          tagIds={tagIds}
          onTagChange={setTagIds}
        />
      </Paper>
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news']);
