import {
  Box,
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
import Link from '~/components/Link';
import routes from '~/routes';

const Container = styled(Paper)`
  display: inline-flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem;
`;

const PositionTitle = styled(Typography)`
  word-break: break-all;
  hyphens: auto;
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
      }}
    >
      <Link href={routes.position(position.id)}>
        <PositionTitle variant="h4" sx={{ mb: position.emailAliases?.length > 0 ? 0 : 1 }}>
          {selectTranslation(i18n, position.name, position.nameEn)}
        </PositionTitle>
      </Link>
      {position.email && (
        <Stack direction="row" flexWrap="wrap" columnGap={2} sx={{ fontSize: 12, mb: 1 }}>
          <Link href={`mailto:${position.email}`}>
            {position.email}
          </Link>
        </Stack>
      )}
      {position.description && (
        <PositionDescription>
          {selectTranslation(i18n, position.description, position.descriptionEn)}
        </PositionDescription>
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
    </Container>
  );
}

export default Position;
