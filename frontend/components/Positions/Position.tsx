import
{
  Box,
  Paper, Stack, Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from '~/components/Link';
import selectTranslation from '~/functions/selectTranslation';
import { PositionsByCommitteeQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import CreateMandate from './CreateMandate';
import Mandate from './Mandate';

function Position({
  position,
  refetch,
}: {
  position: PositionsByCommitteeQuery['positions']['positions'][number];
  refetch: () => void;
}) {
  const { t, i18n } = useTranslation(['common', 'committee']);
  const apiContext = useApiAccess();
  return (
    <Paper sx={{
      p: 2,
    }}
    >
      <Link href={routes.position(position.id)}>
        <Typography variant="h4" sx={{ mb: position.emailAliases?.length > 0 ? 0 : 1 }}>
          {selectTranslation(i18n, position.name, position.nameEn)}
        </Typography>
      </Link>
      {position.email && (
        <Stack direction="row" flexWrap="wrap" columnGap={2} sx={{ fontSize: 12, mb: 1 }}>
          <Link href={`mailto:${position.email}`}>
            {position.email}
          </Link>
        </Stack>
      )}
      {position.description && (
        <Typography sx={{ mb: 1 }}>
          {selectTranslation(i18n, position.description, position.descriptionEn)}
        </Typography>
      )}
      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <Typography>
          {t(
            position?.activeMandates.length > 0
              ? 'committee:current'
              : 'committee:vacant',
          )}
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
        >
          {position?.activeMandates.map((mandate) => (
            <Mandate mandate={mandate} key={mandate.id} refetch={refetch} />
          ))}
        </Box>
      </Stack>
      {hasAccess(apiContext, 'core:mandate:create') && (
        <Stack marginTop="2rem">
          <CreateMandate position={position} refetch={refetch} />
        </Stack>
      )}
    </Paper>
  );
}

export default Position;
