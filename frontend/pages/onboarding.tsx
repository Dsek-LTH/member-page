import {
  Container, Card, CardContent, Typography, Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import React, { useState, useEffect, useContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import SuccessSnackbar from '~/components/Snackbars/SuccessSnackbar';
import ErrorSnackbar from '~/components/Snackbars/ErrorSnackbar';
import { useCreateMemberMutation } from '~/generated/graphql';
import OnboardingEditor from '~/components/Users/OnboardingEditor';
import OnboardingEditorSkeleton from '~/components/Users/OnboardingEditorSkeleton';
import { DecodedKeycloakToken } from '~/types/DecodedKeycloakToken';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';
import DarkModeSelector from '~/components/Header/components/DarkModeSelector';
import DsekIcon from '~/components/Icons/DsekIcon';

const OnboardingContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
  height: '100vh',
  width: '100vw',
}));

export default function OnboardingPage() {
  const { t } = useTranslation(['common', 'member']);
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading } = useContext(UserContext);
  const decodedToken = initialized && (jwt.decode(keycloak.token) as DecodedKeycloakToken);
  const studentId = decodedToken?.preferred_username;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classProgramme, setClassProgramme] = useState('D');
  const [classYear, setClassYear] = useState(DateTime.now().year.toString());
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (!keycloak.authenticated || (!loading && user)) {
      router.push(routes.root);
    }
  }, [keycloak]);

  const [createMember, createMemberStatus] = useCreateMemberMutation({
    variables: {
      studentId,
      firstName,
      lastName,
      classProgramme,
      classYear: Number.parseInt(classYear, 10),
    },
    onCompleted: () => {
      router.push(routes.root);
      /**
       * @TODO FIX THIS UGLY MESS, we get an error on backend for some reason
       * if attempt any request after creating the user.
       */
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
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
    <OnboardingContainer>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        style={{
          padding: '1rem',
        }}
      >
        <DsekIcon color="primary" style={{ fontSize: 48 }} />
        <div>
          <DarkModeSelector />
        </div>
      </Stack>
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
      <Container
        maxWidth="sm"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h2" component="h1">
              {t('welcome')}
            </Typography>
            <Typography variant="body1">
              {t('member:firstSignInDesc')}
            </Typography>
            {window === undefined
              || (!studentId && <OnboardingEditorSkeleton />)}
            {window !== undefined && studentId && (
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
                onSubmit={createMember}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </OnboardingContainer>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'member'])),
  },
});
