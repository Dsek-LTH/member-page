import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import NoTitleLayout from '~/components/NoTitleLayout';
import EditTag from '~/components/Tags/EditTag';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import commonPageStyles from '~/styles/commonPageStyles';

export default function EditArticlePage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const classes = commonPageStyles();
  const apiContext = useApiAccess();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

  const { loading: userLoading } = useUser();

  if (userLoading || !initialized) {
    return null;
  }

  if (
    !keycloak?.authenticated
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
