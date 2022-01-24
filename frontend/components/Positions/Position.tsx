import { Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GetPositionsQuery } from '~/generated/graphql';
import CreateMandate from './CreateMandate';
import selectTranslation from '~/functions/selectTranslation';
import Mandate from './Mandate';
import useCurrentMandates from '~/hooks/useCurrentMandates';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin: 1rem;
`;

const PositionTitle = styled(Typography)`
  margin-bottom: 2rem;
`;

/** @TODO UPDATE THIS TO GET THE MEMBER FROM BACKEND INSTEAD OF USING MANDATES */

function Position({
  position,
}: {
  position: GetPositionsQuery['positions']['positions'][number];
}) {
  const { t, i18n } = useTranslation(['common', 'committee']);
  const { mandates } = useCurrentMandates();
  const apiContext = useApiAccess();
  const mandatesForPosition = mandates.filter(
    (mandate) => mandate.position.id === position.id,
  );
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
      <Stack marginBottom="2rem" spacing={1}>
        <Typography>
          {t(
            mandatesForPosition.length > 0
              ? 'committee:current'
              : 'committee:vacant',
          )}
        </Typography>
        {mandatesForPosition.map((mandate) => (
          <Mandate mandate={mandate} key={mandate.id} />
        ))}
      </Stack>
      {hasAccess(apiContext, 'core:mandate:create') && (
        <CreateMandate position={position} />
      )}
    </Container>
  );
}

export default Position;
