import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import MemberLayout from '../../layouts/memberLayout';
import { useMemberPageQuery } from '../../generated/graphql';
import Member from '../../components/Members/Member';
import MemberSkeleton from '../../components/Members/MemberSkeleton';
import routes from '~/routes';
import { Link, Paper } from '@material-ui/core';
import { commonPageStyles } from '~/styles/commonPageStyles';
import UserContext from '~/providers/UserProvider';


export default function MemberPage() {
  const router = useRouter()
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const { loading, data } = useMemberPageQuery({
    variables: { id: parseInt(id) }
  });
  const classes = commonPageStyles();
  const { t } = useTranslation(['common', 'member']);

  if (loading || !initialized || userLoading) {
    return (
      <MemberLayout>
        <Paper className={classes.innerContainer}>
          <MemberSkeleton />
        </Paper>
      </MemberLayout>
    )
  }

  const member = data?.memberById;

  if (!member) {
    return (
      <MemberLayout>
        {t('memberError')}
      </MemberLayout>
    );
  }
  const name = `${member.first_name} ${member.last_name}`;
  const classYear = `${member.class_programme}${member.class_year % 100}`;
  return (
    <MemberLayout>
      <Paper className={classes.innerContainer}>
        <Member
          name={name}
          classYear={classYear}
          student_id={member.student_id}
          picture_path={member.picture_path} />
        {member.id === user.id && <Link href={routes.editMember(id)}>{t('member:editMember')}</Link>}
      </Paper>
    </MemberLayout >
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'member']),
    }
  }
}