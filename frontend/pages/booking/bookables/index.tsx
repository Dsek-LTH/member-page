import
{
  Box,
  Button, Paper, Table, TableCell, TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useContext } from 'react';
import BookableRow from '~/components/Bookables/BookableRow';
import LoadingTable from '~/components/LoadingTable';
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetAllBookablesQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import UserContext from '~/providers/UserProvider';
import commonPageStyles from '~/styles/commonPageStyles';
import routes from '../../../routes';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function BookablesPage() {
  useSetPageName('Bookables');
  const { loading: userLoading } = useContext(UserContext);
  const classes = commonPageStyles();
  const apiContext = useApiAccess();
  const bookablesQuery = useGetAllBookablesQuery();
  const bookables = bookablesQuery.data?.bookables || [];
  const { t } = useTranslation();

  if (userLoading || bookables === undefined) {
    return (
      <>
        <h2>{t('booking:bookables')}</h2>
        <LoadingTable />
      </>
    );
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:read')) {
    return <h2>You do not have access to this page.</h2>;
  }

  return (
    <Paper className={classes.innerContainer}>
      <Box justifyContent="space-between" display="flex" alignItems="center">
        <h2>{t('booking:bookables')}</h2>
        {hasAccess(apiContext, 'booking_request:bookable:create')
        && <Link href={routes.createBookable} passHref><Button>Create</Button></Link>}
      </Box>
      <Box sx={{ overflowX: 'scroll' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Namn</TableCell>
              <TableCell>Name (en)</TableCell>
              <TableCell>{t('booking:door')}</TableCell>
              <TableCell>{t('booking:disabled')}</TableCell>
              {hasAccess(apiContext, 'booking_request:bookable:update') && <TableCell>Edit</TableCell>}
            </TableRow>
          </TableHead>
          {[...bookables].sort((a, b) => a.name.localeCompare((b.name))).map((bookable) => (
            <BookableRow bookable={bookable} key={bookable.id} />
          ))}
        </Table>
      </Box>
    </Paper>
  );
}

export const getStaticProps = genGetProps(['booking']);
