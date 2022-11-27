import {
  Paper, Stack, Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { PositionsByCommitteeQuery } from '~/generated/graphql';
import CreateMandate from './CreateMandate';
import selectTranslation from '~/functions/selectTranslation';
import Mandate from './Mandate';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem;
`;

const PositionTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const PositionDescription = styled(Typography)`
  margin-bottom: 1rem;
`;

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
    <Container
      sx={{
        minWidth: { xs: '95%', sm: 450, xl: 500 },
        maxWidth: { xs: '95%', sm: 450, xl: 500 },
      }}
    >
      <PositionTitle variant="h4" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {selectTranslation(i18n, position.name, position.nameEn)}
      </PositionTitle>
      {position.description && (
        <PositionDescription>
          {selectTranslation(i18n, position.description, position.descriptionEn)}
        </PositionDescription>
      )}
      <Stack spacing={1}>
        <Typography>
          {t(
            position?.activeMandates.length > 0
              ? 'committee:current'
              : 'committee:vacant',
          )}
        </Typography>
        {position?.activeMandates.map((mandate) => (
          <Mandate mandate={mandate} key={mandate.id} refetch={refetch} />
        ))}
      </Stack>
      {hasAccess(apiContext, 'core:mandate:create') && (
        <Stack marginTop="2rem">
          <CreateMandate position={position} refetch={refetch} />
        </Stack>
      )}
    </Container>
  );
}

export default Position;
