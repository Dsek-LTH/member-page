import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';

export default function EditArticlePage() {
  const { t } = useTranslation();
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
      <Button onClick={() => router.push(routes.tags)}>{t('tags')}</Button>
    </NoTitleLayout>
  );
}

export const getStaticProps = genGetProps(['news']);
