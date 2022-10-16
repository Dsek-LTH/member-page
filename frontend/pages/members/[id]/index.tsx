import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { Button, Paper, Stack } from '@mui/material';
import { useMemberPageQuery } from '~/generated/graphql';
import Member from '~/components/Members/Member';
import MemberSkeleton from '~/components/Members/MemberSkeleton';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function MemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const { loading, data: userData } = useMemberPageQuery({
    variables: { id },
  });
  const classes = commonPageStyles();
  const { t } = useTranslation();

  if (loading || !initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  const member = userData?.memberById;

  if (!member) {
    return <>{t('member:memberError')}</>;
  }
  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Member
          member={member}
        />
        {member.id === user?.id && (
          <Stack direction="row" spacing={2} marginTop={1}>
            <Button href={routes.editMember(id)}>{t('member:editMember')}</Button>
            <Button href={routes.changeProfilePicture(id)}>
              {t('member:changeProfilePicture')}
            </Button>
          </Stack>
        )}
      </Paper>
    </NoTitleLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'member'])),
    },
  };
}
