import
{
  Stack, Table, TableCell, TableHead,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import CreateSettingTableRow from '~/components/Admin/settings/CreateSettingTableRow';
import SettingTableRow from '~/components/Admin/settings/SettingTableRow';
import StabHiddenInput from '~/components/Admin/settings/StabHiddenInput';
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetAdminSettingsQuery } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';

export const getStaticProps = genGetProps(['error']);

export default function Error() {
  const { t } = useTranslation();
  useSetPageName(t('adminSettings'));
  const {
    data, loading, error, refetch,
  } = useGetAdminSettingsQuery();
  const { showMessage } = useSnackbar();
  const { hasAccess } = useApiAccess();
  if (!hasAccess('admin:settings:read')
  || !hasAccess('admin:settings:create')
  || !hasAccess('admin:settings:update')
  || !hasAccess('admin:settings:delete')) {
    return <h2>{t('no_permission_page')}</h2>;
  }
  if (loading) {
    return null;
  }
  if (error) {
    showMessage(error.message, 'error');
    return null;
  }
  const { adminSettings } = data;
  return (
    <Stack
      gap={2}
    >
      <Typography variant="h5" component="h1">
        {t('adminSettings')}
      </Typography>
      <Typography variant="h6">
        Stab Hidden Period
      </Typography>
      <StabHiddenInput />
      <Typography variant="h6">
        All admin settings
      </Typography>
      <Table>
        <TableHead>
          <TableCell>Key</TableCell>
          <TableCell>Value</TableCell>
        </TableHead>
        {adminSettings.map((setting) => (
          <SettingTableRow
            key={setting.key}
            setting={setting}
            refetch={refetch}
          />
        ))}
        {/* Create setting */}
        <Typography variant="h6" component="h2">
          Add new setting
        </Typography>
        <CreateSettingTableRow refetch={refetch} />
      </Table>

    </Stack>
  );
}
