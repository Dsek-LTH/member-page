import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NoTitleLayout from '~/components/NoTitleLayout';
import CreateTag from '~/components/Tags/CreateTag';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import commonPageStyles from '~/styles/commonPageStyles';

export default function EditArticlePage() {
  const { t } = useTranslation();
  const classes = commonPageStyles();
  const apiContext = useApiAccess();

  const { loading: userLoading, user } = useUser();

  if (userLoading) {
    return null;
  }

  if (
    !user
    || !hasAccess(apiContext, 'tags:create')
  ) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('news:admin.tags.create')}
        </Typography>

        <CreateTag />
      </Paper>
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
