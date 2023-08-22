import { useTranslation } from 'next-i18next';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';
import ArticleSkeleton from './articleSkeleton';

type NewsPageProps = {
  pageIndex?: number;
  articlesPerPage?: number;
  tagIds?: string[];
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  small?: boolean
  nollning?: boolean
};

export default function ArticleSet({
  pageIndex = 1,
  articlesPerPage = 5,
  tagIds = [],
  loading,
  setLoading,
  small,
  nollning = false,
}: NewsPageProps) {
  const {
    error, data, refetch,
  } = useNewsPageQuery({
    variables: {
      page_number: pageIndex, per_page: articlesPerPage, tagIds, nollning,
    },
    onCompleted: () => {
      if (setLoading) setLoading(false);
    },
  });
  const { t } = useTranslation('news');
  const articles = data?.news?.articles;

  if (loading) {
    return (
      <>
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
      </>
    );
  }

  if (error) return <p>{t('failedLoadingNews')}</p>;
  if (!articles) return null;
  return (
    <>
      {articles?.map((article) =>
        (article ? (
          <Article
            key={article.id}
            refetch={refetch}
            article={article}
            small={small}
          />
        ) : (
          <div>{t('news:articleError.missing')}</div>
        )))}
    </>
  );
}
