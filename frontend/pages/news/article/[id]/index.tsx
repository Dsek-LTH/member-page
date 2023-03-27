import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Article from '~/components/News/article';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { idOrSlug } from '~/functions/isUUID';
import { useArticleQuery } from '~/generated/graphql';

export default function ArticlePage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, data, refetch } = useArticleQuery({
    variables: idOrSlug(id),
  });

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
    return <NoTitleLayout>{t('articleError')}</NoTitleLayout>;
  }

  return (
    <NoTitleLayout>
      <Article refetch={refetch} article={article} fullArticle />
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news']);
