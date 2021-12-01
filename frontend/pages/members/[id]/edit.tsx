import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useMemberPageQuery } from '~/generated/graphql';
import MemberEditorSkeleton from '~/components/MemberEditor/MemberEditorSkeleton';
import { useUpdateMemberMutation } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import MemberEditor from '~/components/MemberEditor';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import { Paper, Typography } from '@mui/material';
import { commonPageStyles } from '~/styles/commonPageStyles';
import NoTitleLayout from '~/components/NoTitleLayout';

export default function EditMemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const classes = commonPageStyles();

  const { loading, data } = useMemberPageQuery({
    variables: { id: id },
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [classProgramme, setClassProgramme] = useState('');
  const [classYear, setClassYear] = useState('');
  const [picturePath, setPicturePath] = useState('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);

  const [updateMember, updateMemberStatus] = useUpdateMemberMutation({
    variables: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      classProgramme: classProgramme,
      classYear: Number.parseInt(classYear),
      picturePath: picturePath,
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

  useEffect(() => {
    if (!updateMemberStatus.loading && updateMemberStatus.called) {
      if (updateMemberStatus.error) {
        setErrorOpen(true);
        setSuccessOpen(false);
      } else {
        setErrorOpen(false);
        setSuccessOpen(true);
      }
    } else {
      setSuccessOpen(false);
      setErrorOpen(false);
    }
  }, [updateMemberStatus.loading]);

  const { t } = useTranslation(['common', 'member']);

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

  if (!member || user.id != member.id) {
    return <>{t('memberError')}</>;
  }

  return (
    <NoTitleLayout>
      <SuccessSnackbar
        open={successOpen}
        onClose={setSuccessOpen}
        message={t('edit_saved')}
      />

      <ErrorSnackbar
        open={errorOpen}
        onClose={setErrorOpen}
        message={t('error')}
      />
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
