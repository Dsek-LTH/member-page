import
{
  Button,
  Checkbox, FormControl, FormControlLabel, InputLabel,
  MenuItem, Select, Stack, TextField,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { useEditBookableMutation, useGetAllBookablesQuery, useGetDoorsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import UserContext from '~/providers/UserProvider';
import routes from '~/routes';

export default function EditBookable() {
  useSetPageName('Bookables');
  const { t } = useTranslation();
  const { loading: userLoading } = useContext(UserContext);
  const { data } = useGetDoorsQuery();
  const doors = data?.doors || [];
  const router = useRouter();
  const id = router.query.id as string;
  const apiContext = useApiAccess();
  const bookablesQuery = useGetAllBookablesQuery();
  const bookable = bookablesQuery.data?.bookables.find((b) => b.id === id);
  const [name, setName] = useState(bookable?.name);
  const [nameEn, setNameEn] = useState(bookable?.name_en);
  const [isDisabled, setIsDisabled] = useState(bookable?.isDisabled);
  const [door, setDoor] = useState(bookable?.door?.name || 'none');
  const { showMessage } = useSnackbar();

  const [updateBookable] = useEditBookableMutation({
    variables: {
      id,
      input: {
        name,
        name_en: nameEn,
        isDisabled,
        door: door === 'none' ? null : door,
      },
    },
  });

  useEffect(() => {
    if (!bookable) return;
    setName(bookable.name);
    setNameEn(bookable.name_en);
    setIsDisabled(bookable.isDisabled);
    setDoor(bookable.door?.name);
  }, [bookable]);

  if (!bookable) {
    return <div>Bookable not found</div>;
  }

  if (userLoading) {
    return <PageHeader>Edit Bookable</PageHeader>;
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:update')) {
    return <PageHeader>{t('no_permission_page')}</PageHeader>;
  }

  return (
    <>
      <PageHeader>Edit Bookable</PageHeader>
      <form>
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="English name"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
          />
          <FormControl>
            <InputLabel id="doors-dropdown">Door</InputLabel>
            <Select label="Door" labelId="doors-dropdown" value={door} onChange={(e) => setDoor(e.target.value)}>
              <MenuItem value="none"> - none -</MenuItem>
              {doors.map((d) => (
                <MenuItem key={`doors-dropdown-${d.name}`} value={d.name}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isDisabled}
                onChange={(e) => setIsDisabled(e.target.checked)}
              />
            )}
            label="Is disabled"
          />
          <Button
            variant="contained"
            onClick={() => updateBookable()
              .then(() => {
                showMessage('Bookable successfully saved', 'success');
                bookablesQuery.refetch().then(() => router.push(routes.bookables));
              })
              .catch((err) => handleApolloError(err, showMessage, t))}
          >
            Save
          </Button>
        </Stack>
      </form>
    </>
  );
}

export const getServerSideProps = genGetProps(['booking']);
