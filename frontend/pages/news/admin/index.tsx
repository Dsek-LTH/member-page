import { Button } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import NoTitleLayout from '~/components/NoTitleLayout';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';

export default function EditArticlePage() {
  const { t } = useTranslation();
  const apiContext = useApiAccess();
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

  const { loading: userLoading } = useUser();

  if (userLoading || !initialized) {
    return null;
  }

  if (
    !keycloak?.authenticated
    || (!hasAccess(apiContext, 'tags:update')
    && !hasAccess(apiContext, 'tags:create'))
  ) {
    return <>{t('notAuthenticated')}</>;
  }

  return (
    <NoTitleLayout>
      <Button onClick={() => router.push(routes.tags)}>{t('tags')}</Button>
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
