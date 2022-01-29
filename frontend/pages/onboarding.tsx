import {
  Container, Card, CardContent, Typography, Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { useCreateMemberMutation } from '~/generated/graphql';
import OnboardingEditor from '~/components/Users/OnboardingEditor';
import OnboardingEditorSkeleton from '~/components/Users/OnboardingEditorSkeleton';
import { DecodedKeycloakToken } from '~/types/DecodedKeycloakToken';
import routes from '~/routes';
import UserContext from '~/providers/UserProvider';
import DarkModeSelector from '~/components/Header/components/DarkModeSelector';
import DsekIcon from '~/components/Icons/DsekIcon';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

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
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (!keycloak.authenticated || (!loading && user)) {
      router.push(routes.root);
    }
  }, [keycloak, loading, router, user]);

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
      showMessage(t('edit_saved'), 'success');

      /** @TODO FIX THIS UGLY MESS, we get an error on backend for some reason if
       * attempt any request after creating the user. */
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t);
    },
  });

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
            {typeof window === 'undefined'
              || (!studentId && <OnboardingEditorSkeleton />)}
            {typeof window !== 'undefined' && studentId && (
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
