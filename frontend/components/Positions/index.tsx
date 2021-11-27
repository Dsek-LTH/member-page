import { Stack, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { usePositions } from '~/hooks/usePositions';
import { useCurrentMandates } from '~/hooks/useCurrentMandates';
import Link from '~/components/Link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Position from './Position';
import routes from '~/routes';

const PositionsContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Positions = ({ id }: { id: number }) => {
  const { positions, loading } = usePositions(id);
  const { mandates } = useCurrentMandates();
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
          sx={{ fontSize: { xs: '1.8rem', sm: '3rem' } }}
        >
          {positions.length > 0
            ? positions[0].committee.name
            : 'Inga positioner i detta utskott'}
        </Typography>
      </Stack>
      <PositionsContainer>
        {positions.map((position) => (
          <Position key={position.id} position={position} mandates={mandates} />
        ))}
      </PositionsContainer>
    </Stack>
  );
};

export default Positions;
