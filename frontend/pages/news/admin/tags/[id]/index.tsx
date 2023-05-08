import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import NoTitleLayout from '~/components/NoTitleLayout';
import EditTag from '~/components/Tags/EditTag';
import genGetProps from '~/functions/genGetServerSideProps';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useUser } from '~/providers/UserProvider';
import commonPageStyles from '~/styles/commonPageStyles';

export default function EditArticlePage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const classes = commonPageStyles();
  const apiContext = useApiAccess();
  useSetPageName(t('news:admin.tags.edit'));

  const { loading: userLoading, user } = useUser();

  if (userLoading) {
    return null;
  }

  if (
    !user
    || !hasAccess(apiContext, 'tags:update')
  ) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('news:admin.tags.edit')}
        </Typography>

        <EditTag id={query.id as string} />
      </Paper>
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news']);
