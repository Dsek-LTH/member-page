/* eslint-disable no-nested-ternary */
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useTranslation } from 'next-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from '~/components/Link';
import Position from './Position';
import routes from '~/routes';
import Markdown from '../Markdown';
import selectTranslation from '~/functions/selectTranslation';
import sortByName from '~/functions/sortByName';
import usePositionsByCommittee from '~/hooks/usePositionsByCommittee';

const PositionsContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -1rem !important;
`;

function Positions({ committeeId }: { committeeId: string }) {
  const { positions, loading, refetch } = usePositionsByCommittee(committeeId);
  const { t, i18n } = useTranslation();
  const isBoard = committeeId === 'styr';
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Link href={routes.committees}>
          <ArrowBackIosNewIcon fontSize="large" />
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
      && <Markdown name={isBoard ? 'styr' : `${positions[0].committee.shortName}`} />}
      <PositionsContainer>
        {[...positions].sort(sortByName).map((position) => (
          <Position key={position.id} position={position} refetch={refetch} />
        ))}
      </PositionsContainer>
    </Stack>
  );
}

export default Positions;
