import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { useGetAllBookablesQuery, useEditBookableMutation } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function EditBookable() {
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading: userLoading } = useContext(UserContext);
  const router = useRouter();
  const id = router.query.id as string;
  const apiContext = useApiAccess();
  const bookablesQuery = useGetAllBookablesQuery();
  const bookable = bookablesQuery.data?.bookables.find((b) => b.id === id);
  const [name, setName] = useState(bookable?.name);
  const [name_en, setName_en] = useState(bookable?.name_en);
  const [isDisabled, setIsDisabled] = useState(bookable?.isDisabled);

  const [updateBookable] = useEditBookableMutation({
    variables: {
      id,
      input: {
        name,
        name_en,
        isDisabled,
      },
    },
  });

  useEffect(() => {
    if (!bookable) return;
    setName(bookable.name);
    setName_en(bookable.name_en);
    setIsDisabled(bookable.isDisabled);
  }, [bookable]);

  if (!bookable) {
    return <div>Bookable not found</div>;
  }

  if (!initialized || userLoading) {
    return <h2>Edit Bookable</h2>;
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:update')) {
    return <h2>You do not have access to this page</h2>;
  }

  return (
    <>
      <h2>Edit Bookable</h2>
      <form>
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            variant="outlined"
            value={name_en}
            onChange={(e) => setName_en(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={isDisabled}
                onChange={(e) => setIsDisabled(e.target.checked)}
              />
            )}
            label="Is disabled"
          />
          <Button variant="contained" onClick={() => updateBookable}>
            Save
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
