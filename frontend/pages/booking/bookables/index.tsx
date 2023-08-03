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
import PageHeader from '~/components/PageHeader';

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
        <PageHeader>{t('booking:bookables')}</PageHeader>
        <LoadingTable />
      </>
    );
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:read')) {
    return <PageHeader>{t('no_permission_page')}</PageHeader>;
  }

  return (
    <Paper className={classes.innerContainer}>
      <Box justifyContent="space-between" display="flex" alignItems="center">
        <PageHeader>{t('booking:bookables')}</PageHeader>
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
