/* eslint-disable no-nested-ternary */
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from '~/components/Link';
import selectTranslation from '~/functions/selectTranslation';
import sortByName from '~/functions/sortByName';
import usePositionsByCommittee from '~/hooks/usePositionsByCommittee';
import routes from '~/routes';
import MarkdownPage from '../MarkdownPage';
import Position from './Position';

function Positions({ shortName }: { shortName: string }) {
  const { positions, loading, refetch } = usePositionsByCommittee(shortName);
  const { t, i18n } = useTranslation();
  const isBoard = shortName === 'styr';
  return (
    <Stack gap={2}>
      <Stack sx={{ marginTop: { xs: '1rem', md: 0 } }} direction="row" alignItems="center" spacing={2}>
        <Link href={routes.committees}>
          <ArrowBackIosNewIcon fontSize="large" style={{ marginTop: '0.5rem' }} />
        </Link>
        <Typography
          variant="h3"
          component="h1"
          visibility={loading ? 'hidden' : 'visible'}
          sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}
        >
          {isBoard ? selectTranslation(i18n, 'Styrelsen', 'The Board')
            : positions.length > 0
              ? positions[0].committee.name
              : t('committee:noPositions')}
        </Typography>
      </Stack>
      {positions.length > 0
      && <MarkdownPage name={isBoard ? 'styr' : `${positions[0].committee.shortName}`} />}
      <Stack sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(450px, 100%), 1fr))',
        gap: 2,
      }}
      >
        {[...positions].sort(sortByName).map((position) => (
          <Position key={position.id} position={position} refetch={refetch} />
        ))}
      </Stack>
    </Stack>
  );
}

export default Positions;
