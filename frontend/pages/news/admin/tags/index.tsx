import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { IconButton, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import NoTitleLayout from '~/components/NoTitleLayout';
import NewsTagList from '~/components/Tags/NewsTagList';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';

export default function EditArticlePage() {
  const { t } = useTranslation();
  const classes = commonPageStyles();
  const apiContext = useApiAccess();
  const router = useRouter();

  const { loading: userLoading, user } = useUser();

  if (userLoading) {
    return null;
  }

  if (
    !user
    || (!hasAccess(apiContext, 'tags:update')
    && !hasAccess(apiContext, 'tags:create'))
  ) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('news:tags')}
        </Typography>
        {hasAccess(apiContext, 'tags:create') && (
        <Stack direction="row" spacing={1} alignItems="center">
          <h2>New tag</h2>
          {hasAccess(apiContext, 'news:article:create') && (
            <IconButton
              onClick={() => router.push(routes.createTag)}
              style={{ height: 'fit-content' }}
            >
              <ControlPointIcon />
            </IconButton>
          )}
        </Stack>
        )}

        <NewsTagList />
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
