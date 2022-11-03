import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { Paper, Typography } from '@mui/material';
import { useMemberPageQuery, useUpdateMemberMutation } from '~/generated/graphql';
import MemberEditorSkeleton from '~/components/MemberEditor/MemberEditorSkeleton';
import UserContext from '~/providers/UserProvider';
import MemberEditor from '~/components/MemberEditor';
import commonPageStyles from '~/styles/commonPageStyles';
import NoTitleLayout from '~/components/NoTitleLayout';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import { useApiAccess } from '~/providers/ApiAccessProvider';

export default function EditMemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const classes = commonPageStyles();

  const { loading, data } = useMemberPageQuery({
    variables: { id },
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [classProgramme, setClassProgramme] = useState('');
  const [classYear, setClassYear] = useState('');
  const [picturePath, setPicturePath] = useState('');
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();
  const { t } = useTranslation(['common', 'member']);

  const [updateMember, updateMemberStatus] = useUpdateMemberMutation({
    variables: {
      id,
      firstName,
      lastName,
      nickname,
      classProgramme,
      classYear: parseInt(classYear, 10),
      picturePath,
    },
    onCompleted: () => {
      showMessage(t('edit_saved'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });

  useEffect(() => {
    setFirstName(data?.member?.first_name || '');
    setLastName(data?.member?.last_name || '');
    setNickname(data?.member?.nickname || '');
    setClassProgramme(data?.member?.class_programme || '');
    setClassYear(data?.member?.class_year.toString() || '');
    setPicturePath(data?.member?.picture_path || '');
  }, [data]);

  if (loading || !initialized || userLoading) {
    return (
      <NoTitleLayout>
        <Paper className={classes.innerContainer}>
          <MemberEditorSkeleton />
        </Paper>
      </NoTitleLayout>
    );
  }

  const member = data?.member;

  if (!member || (user?.id !== member.id && !hasAccess('core:member:update'))) {
    return <>{t('no_permission_page')}</>;
  }

  return (
    <NoTitleLayout>
      <Paper className={classes.innerContainer}>
        <Typography variant="h3" component="h1">
          {t('member:editMember')}
        </Typography>
        <MemberEditor
          firstName={firstName}
          lastName={lastName}
          nickname={nickname}
          classProgramme={classProgramme}
          classYear={classYear}
          picturePath={picturePath}
          loading={updateMemberStatus.loading}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onNicknameChange={setNickname}
          onClassProgrammeChange={setClassProgramme}
          onClassYearChange={setClassYear}
          onPicturePathChange={setPicturePath}
          onSubmit={updateMember}
        />
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
