import { Container, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useContext } from 'react';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import { useCreateMemberMutation } from '~/generated/graphql';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import OnboardingEditor from '~/components/Users/OnboardingEditor';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import OnboardingEditorSkeleton from '~/components/Users/OnboardingEditorSkeleton';
import { useRouter } from 'next/router';
import { DecodedKeycloakToken } from '~/types/DecodedKeycloakToken';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';

export default function OnboardingPage() {
  const { t } = useTranslation(['common', 'member']);
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading } = useContext(UserContext);
  const decodedToken = initialized && jwt.decode(keycloak.token) as DecodedKeycloakToken;
  const studentId = decodedToken?.preferred_username;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classProgramme, setClassProgramme] = useState('');
  const [classYear, setClassYear] = useState(DateTime.now().year.toString());
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (!keycloak.authenticated || (!loading && user)) {
      router.push(routes.root);
    }
  }, [keycloak])

  const [createMember, createMemberStatus] = useCreateMemberMutation({
    variables: {
      studentId: studentId,
      firstName: firstName,
      lastName: lastName,
      classProgramme: classProgramme,
      classYear: Number.parseInt(classYear),
    }
  });

  useEffect(() => {
    setFirstName(decodedToken?.given_name);
    setLastName(decodedToken?.family_name);
  }, [initialized]);

  useEffect(() => {
    if (!createMemberStatus.loading && createMemberStatus.called) {
      if (createMemberStatus.error) {
        setErrorOpen(true);
        setSuccessOpen(false);
      } else {
        setErrorOpen(false);
        setSuccessOpen(true);
        router.push(routes.root);
      }
    } else {
      setSuccessOpen(false);
      setErrorOpen(false);
    }
  }, [createMemberStatus.loading]);

  return (
    <>
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
      <Container maxWidth='sm' style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Card>
          <CardContent>
            <Typography variant='h2' component='h1'>{t('welcome')}</Typography>
            <Typography variant='body1'>{t('member:firstSignInDesc')}</Typography>
            {typeof (window) === undefined || !studentId && (
              <OnboardingEditorSkeleton />
            )}
            {typeof (window) !== undefined && studentId && (
              <OnboardingEditor
                firstName={firstName}
                lastName={lastName}
                classProgramme={classProgramme}
                classYear={classYear}
                loading={createMemberStatus.loading}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onClassProgrammeChange={setClassProgramme}
                onClassYearChange={setClassYear}
                onSubmit={createMember} />
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'header', 'member']),
  },
})
