import { Alert } from '@mui/material';
import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Article from '~/components/News/article';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { idOrSlug } from '~/functions/isUUID';
import selectTranslation from '~/functions/selectTranslation';
import { ArticleRequestStatus, useArticleQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function ArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data, refetch } = useArticleQuery({
    variables: idOrSlug(id),
  });
  useSetPageName(
    data?.article?.header || 'Article',
    selectTranslation(i18n, 'Nyhet', 'Article'),
  );

  const { t } = useTranslation(['common', 'news']);

  if (loading) {
    return (
      <NoTitleLayout>
        <ArticleSkeleton fullArticle />
      </NoTitleLayout>
    );
  }

  const article = data?.article;

  if (!article) {
    return <NoTitleLayout>{t('news:articleError.missing')}</NoTitleLayout>;
  }

  return (
    <NoTitleLayout>
      {article.status !== ArticleRequestStatus.Approved && (
        <Alert severity={article.status === ArticleRequestStatus.Rejected ? 'error' : 'info'} sx={{ my: 1, textTransform: 'capitalize' }}>
          {article.status}
        </Alert>
      )}
      <Article refetch={refetch} article={article} fullArticle />
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news']);
