import
{
  Box,
  Link as MuiLink,
  Paper, Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import selectTranslation from '~/functions/selectTranslation';
import useCommittees from '~/hooks/useCommittees';
import routes from '~/routes';
import CommitteeIcon from './CommitteeIcon';

function CommitteesList() {
  const { committees } = useCommittees();
  const { i18n } = useTranslation('common');

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
      gap: 2,
    }}
    >
      {committees.map((committee) => (
        <Stack key={committee.id}>
          <Link href={routes.committeePage(committee.shortName)} passHref>
            <MuiLink>
              <Paper sx={{ padding: 4 }}>
                <CommitteeIcon
                  name={committee.name}
                  color="primary"
                  style={{ marginRight: '1rem' }}
                />
                {selectTranslation(i18n, committee.name, committee?.name_en)}
              </Paper>
            </MuiLink>
          </Link>
        </Stack>
      ))}
    </Box>
  );
}

export default CommitteesList;
