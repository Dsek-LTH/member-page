import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext } from 'react';
import Link from 'next/link';
import BookableRow from '~/components/Bookables/BookableRow';
import LoadingTable from '~/components/LoadingTable';
import { useGetAllBookablesQuery } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import routes from '../../../routes';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function BookablesPage() {
  const { initialized } = useKeycloak<KeycloakInstance>();
  const { loading: userLoading } = useContext(UserContext);
  const apiContext = useApiAccess();
  const bookablesQuery = useGetAllBookablesQuery();
  const bookables = bookablesQuery.data?.bookables || [];

  if (!initialized || userLoading || bookables === undefined) {
    return (
      <>
        <h2>Bookables</h2>
        <LoadingTable />
      </>
    );
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:read')) {
    return <h2>You do not have access to this page.</h2>;
  }

  return (
    <>
      <Box justifyContent="space-between" display="flex" alignItems="center">
        <h2>Bookables</h2>
        {hasAccess(apiContext, 'booking_request:bookable:create') && <Link href={routes.createBookable}><Button>Create</Button></Link>}
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Name (en)</TableCell>
            <TableCell>Door</TableCell>
            <TableCell>Disabled</TableCell>
            {hasAccess(apiContext, 'booking_request:bookable:update') && <TableCell>Edit</TableCell>}
          </TableRow>
        </TableHead>
        {[...bookables].sort((a, b) => a.name.localeCompare((b.name))).map((bookable) => (
          <BookableRow bookable={bookable} key={bookable.id} />
        ))}
      </Table>

    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'booking'])),
  },
});
