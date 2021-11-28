import { Paper, Stack, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState, useCallback } from 'react';
import {
  GetMandatesByPeriodQuery,
  GetMembersQuery,
  GetPositionsQuery,
  useCreateMandateMutation,
} from '~/generated/graphql';
import Link from 'components/Link';
import routes from '~/routes';
import MembersSelector from '~/components/Members/MembersSelector';
import { getFullName } from '~/functions/memberFunctions';
import CreateMandate from './CreateMandate';
import { useTranslation } from 'react-i18next';
import { selectTranslation } from '~/functions/selectTranslation';
import Mandate from './Mandate';
import { useCurrentMandates } from '~/hooks/useCurrentMandates';

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

const Position = ({
  position,
}: {
  position: GetPositionsQuery['positions']['positions'][number];
}) => {
  const { t, i18n } = useTranslation(['common', 'committee']);
  const { mandates } = useCurrentMandates();
  const mandatesForPosition = mandates.filter(
    (mandate) => mandate.position.id === position.id
  );
  return (
    <Container sx={{ minWidth: { xs: '95%', sm: 350, xl: 500 } }}>
      <PositionTitle variant="h4">
        {selectTranslation(i18n, position.name, position.nameEn)}
      </PositionTitle>
      <Stack marginBottom="2rem" spacing={1}>
        <Typography>
          {t(
            mandatesForPosition.length > 0
              ? 'committee:current'
              : 'committee:vacant'
          )}
        </Typography>
        {mandatesForPosition.map((mandate) => (
          <Mandate mandate={mandate} key={mandate.id} />
        ))}
      </Stack>
      <CreateMandate position={position} />
    </Container>
  );
};

export default Position;
