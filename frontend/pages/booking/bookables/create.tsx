import {
  Button,
  Stack,
  FormControlLabel,
  TextField,
  Checkbox,
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetAllBookablesQuery } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import { useEditBookableMutation } from '../../../../generated/graphql';
import { useCreateBookableMutation } from '../../../generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function EditBookable() {
  const { t } = useTranslation(['common', 'booking']);
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { user, loading: userLoading } = useContext(UserContext);
  const apiContext = useApiAccess();
  const [name, setName] = useState("");
  const [name_en, setName_en] = useState<string | undefined>(undefined);
  
  const [createBookable] = useCreateBookableMutation({
    variables: {
      input: {
        name,
        name_en,
      }
  }});

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
          <TextField variant="outlined" value={name} onChange={e => setName(e.target.value)} fullWidth />
          <TextField variant="outlined" value={name_en} onChange={e => setName_en(e.target.value)} fullWidth placeholder={name} />
          <Button variant="contained" onClick={createBookable}>Create</Button>
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