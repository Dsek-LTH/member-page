import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useMemberPageQuery } from '~/generated/graphql';
import Member from '~/components/Members/Member';
import MemberSkeleton from '~/components/Members/MemberSkeleton';
import routes from '~/routes';
import { Button, Paper } from '@mui/material';
import { commonPageStyles } from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';
import { getClassYear, getFullName } from '~/functions/memberFunctions';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function MemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const { loading, data } = useMemberPageQuery({
    variables: { id: id },
  });
  const classes = commonPageStyles();
  const { t } = useTranslation(['common', 'member']);

  if (loading || !initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  const member = data?.memberById;

  if (!member) {
    return <>{t('memberError')}</>;
  }
  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Member
          name={getFullName(member)}
          classYear={getClassYear(member)}
          student_id={member.student_id}
          picture_path={member.picture_path}
        />
        {member.id === user?.id && (
          <Button href={routes.editMember(id)}>{t('member:editMember')}</Button>
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
