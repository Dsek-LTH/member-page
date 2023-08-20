import AddIcon from '@mui/icons-material/Add';
import {
  Box, Button, Pagination, Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Article from '~/components/Nolla/Article';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import useNollaTranslate from '~/components/Nolla/useNollaTranslate';
import genGetProps from '~/functions/genGetServerSideProps';
import { useNewsPageQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

const ARTICLES_PER_PAGE = 10;

export default function News() {
  const apiContext = useApiAccess();
  const router = useRouter();
  const { t } = useTranslation('common');
  const translate = useNollaTranslate();
  const currentPage = parseInt(router.query.page as string, 10) || 1;
  const { data, loading } = useNewsPageQuery({
    variables: {
      page_number: currentPage,
      per_page: ARTICLES_PER_PAGE,
      nollning: true,
    },
  });
  const totalPages = data?.news?.pageInfo?.totalPages || 1;
  const articles = data?.news?.articles || [];

  if (!loading && articles.length === 0) {
    return <Typography variant="h4">{translate('news.empty')}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {hasAccess(apiContext, 'news:article:create') && (
        <Button
          onClick={() => router.push(routes.createArticle)}
          variant="outlined"
        >
          {t('news:new_article')}
          <AddIcon style={{ marginLeft: '0.25rem' }} />
        </Button>
      )}

      {articles.map((article) =>
        (article ? (
          <Article key={article.id} article={article} />
        ) : (
          <div>{t('news:articleError.missing')}</div>
        )))}

      <Pagination
        page={currentPage}
        count={totalPages}
        onChange={(_, page) => router.push(`?page=${page}`)}
      />
    </Box>
  );
}

export const getServerSideProps = genGetProps(['nolla', 'news']);

News.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

News.theme = theme;
