import {
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import UserContext from '~/providers/UserProvider';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useCreateBookableMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import routes from '~/routes';

export default function EditBookable() {
  const { t } = useTranslation();
  const router = useRouter();
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading: userLoading } = useContext(UserContext);
  const apiContext = useApiAccess();
  const [name, setName] = useState('');
  const [name_en, setName_en] = useState<string | undefined>(undefined);
  const { showMessage } = useSnackbar();
  const [createBookable] = useCreateBookableMutation({
    variables: {
      input: {
        name,
        name_en,
      },
    },
  });

  if (!initialized || userLoading) {
    return (
      <h2>Create Bookable</h2>
    );
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:create')) {
    return <h2>You do not have access to this page</h2>;
  }

  return (
    <>
      <h2>Create Bookable</h2>
      <form>
        <Stack spacing={2}>
          <TextField label="Name" placeholder="Rosa gaffel" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="English name" variant="outlined" value={name_en} onChange={(e) => setName_en(e.target.value)} fullWidth />
          <Button
            variant="contained"
            onClick={() => createBookable()
              .then(() => {
                showMessage('Bookable successfully created', 'success');
                router.push(routes.bookables);
              })
              .catch((err) => handleApolloError(err, showMessage, t))}
          >
            Create

          </Button>
        </Stack>
      </form>
    </>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'booking'])),
  },
});
