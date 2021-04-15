import React from 'react';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import MemberLayout from '../../layouts/memberLayout';
import { useMemberPageQuery } from '../../generated/graphql';
import Member from '../../components/Members/Member';
import MemberSkeleton from '../../components/Members/MemberSkeleton';


export default function MemberPage() {
  const router = useRouter()
  const slug = router.query.slug as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading, data } = useMemberPageQuery({
    variables: { student_id: slug }
  });

  const { t } = useTranslation(['common', 'member']);

  if (loading || !initialized) {
    return (
      <MemberLayout>
        <MemberSkeleton />
      </MemberLayout>
    )
  }

  const member = data?.memberByStudentId;

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
      <Member
        name={name}
        classYear={classYear}
        student_id={member.student_id}
        picture_path={member.picture_path} />
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