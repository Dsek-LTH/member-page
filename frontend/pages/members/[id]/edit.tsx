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
    setFirstName(data?.memberById?.first_name || '');
    setLastName(data?.memberById?.last_name || '');
    setNickname(data?.memberById?.nickname || '');
    setClassProgramme(data?.memberById?.class_programme || '');
    setClassYear(data?.memberById?.class_year.toString() || '');
    setPicturePath(data?.memberById?.picture_path || '');
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

  const member = data?.memberById;

  if (!member || user.id !== member.id) {
    return <>{t('memberError')}</>;
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
