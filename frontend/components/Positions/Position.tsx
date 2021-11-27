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

const Container = styled(Paper)`
  padding: 2rem;
`;

const PositionTitle = styled(Typography)`
  margin-bottom: 2rem;
`;

/** @TODO UPDATE THIS TO GET THE MEMBER FROM BACKEND INSTEAD OF USING MANDATES */

const Position = ({
  position,
  mandates,
  refetchMandates,
}: {
  position: GetPositionsQuery['positions']['positions'][number];
  mandates: GetMandatesByPeriodQuery['mandates']['mandates'];
  refetchMandates: () => void;
}) => {
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState<number>(null);
  const mandatesForPosition = mandates.filter(
    (mandate) => mandate.position.id === position.id
  );
  const [createMandateMutation, { loading }] = useCreateMandateMutation({
    variables: {
      memberId: selectedMemberToAdd,
      positionId: position.id,
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(new Date().getFullYear(), 12, 31),
    },
    onCompleted: () => {
      refetchMandates();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return (
    <Container>
      <PositionTitle variant="h4">{position.name}</PositionTitle>
      <Stack marginBottom="2rem">
        <Typography>Nuvarande innehavare:</Typography>
        {mandatesForPosition.map((mandate) => (
          <Link href={routes.member(mandate.member.id)} key={mandate.id}>
            {getFullName(mandate.member)}
          </Link>
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        <MembersSelector setSelectedMember={setSelectedMemberToAdd} />
        <Button
          variant="outlined"
          onClick={() => createMandateMutation()}
          disabled={!selectedMemberToAdd}
          style={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
        >
          Lägg till
        </Button>
      </Stack>
    </Container>
  );
};

export default Position;
