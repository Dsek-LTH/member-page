/* eslint-disable no-nested-ternary */
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useTranslation } from 'next-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from '~/components/Link';
import Position from './Position';
import routes from '~/routes';
import MarkdownPage from '../MarkdownPage';
import selectTranslation from '~/functions/selectTranslation';
import sortByName from '~/functions/sortByName';
import usePositionsByCommittee from '~/hooks/usePositionsByCommittee';
import Stepper from '~/components/Mandates/Stepper';

const PositionsContainer = styled(Stack)`
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -1rem !important;
`;

function Positions({ shortName }: { shortName: string }) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const currentYear = year;
  const lthOpens = 1961;
  const timeInterval = currentYear - lthOpens;
  const { positions, loading, refetch } = usePositionsByCommittee(shortName, year);
  const { t, i18n } = useTranslation();
  const isBoard = shortName === 'styr';
  const moveForward = () => {
    setYear(year - 1);
  };
  const moveBackward = () => {
    setYear(year + 1);
  };
  return (
    <Stack spacing={2}>
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
      <Stepper
        moveForward={moveForward}
        moveBackward={moveBackward}
        year={year}
        idx={timeInterval - (year - lthOpens)}
        maxSteps={timeInterval}
      />
      {positions.length > 0
      && <MarkdownPage name={isBoard ? 'styr' : `${positions[0].committee.shortName}`} />}
      <PositionsContainer sx={{
        gridTemplateColumns: { sm: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
      }}
      >
        {[...positions].sort(sortByName).map((position) => (
          <Position key={position.id} position={position} refetch={refetch} />
        ))}
      </PositionsContainer>
    </Stack>
  );
}

export default Positions;
