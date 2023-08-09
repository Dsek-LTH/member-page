import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import MemberEditor from '~/components/MemberEditor';
import MemberEditorSkeleton from '~/components/MemberEditor/MemberEditorSkeleton';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { useMemberPageQuery, useUpdateMemberMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import UserContext from '~/providers/UserProvider';
import routes from '~/routes';
import commonPageStyles from '~/styles/commonPageStyles';

export default function EditMemberPage() {
  const router = useRouter();
  const id = router.query.id as string;
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
  const [foodPreference, setFoodPreference] = useState('');
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();
  const { t } = useTranslation(['member']);
  useSetPageName(t('member:editMember'));

  const [updateMember, updateMemberStatus] = useUpdateMemberMutation({
    variables: {
      id,
      firstName,
      lastName,
      nickname,
      classProgramme,
      classYear: parseInt(classYear, 10),
      picturePath,
      foodPreference,
    },
    onCompleted: () => {
      showMessage(t('edit_saved'), 'success');
      router.push(routes.member(id));
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
    setClassYear(data?.member?.class_year?.toString() || '');
    setPicturePath(data?.member?.picture_path || '');
    setFoodPreference(data?.member?.food_preference || '');
  }, [data]);

  if (loading || userLoading) {
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
        <Typography variant="h4" component="h1">
          {t('member:editMember')}
        </Typography>
        <MemberEditor
          firstName={firstName}
          lastName={lastName}
          nickname={nickname}
          classProgramme={classProgramme}
          classYear={classYear}
          picturePath={picturePath}
          foodPreference={foodPreference}
          loading={updateMemberStatus.loading}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onNicknameChange={setNickname}
          onClassProgrammeChange={setClassProgramme}
          onClassYearChange={setClassYear}
          onPicturePathChange={setPicturePath}
          onFoodPreferenceChange={setFoodPreference}
          onSubmit={updateMember}
        />
      </Paper>
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['member']);
