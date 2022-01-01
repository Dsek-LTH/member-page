import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import usePositions from '~/hooks/usePositions';
import Link from '~/components/Link';
import Position from './Position';
import routes from '~/routes';

const PositionsContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -1rem !important;
`;

function Positions({ committeeId }: { committeeId: string }) {
  const { positions, loading } = usePositions(committeeId);
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
          {positions.length > 0
            ? positions[0].committee.name
            : 'Inga positioner i detta utskott'}
        </Typography>
      </Stack>
      <Typography margin="1rem 0 !important">
        Här kommer det att finnas text som utskotten själva kan ändra på!
      </Typography>
      <PositionsContainer>
        {positions.map((position) => (
          <Position key={position.id} position={position} />
        ))}
      </PositionsContainer>
    </Stack>
  );
}

export default Positions;
