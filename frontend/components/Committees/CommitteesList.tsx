import Link from '~/components/Link';
import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useCommittees } from '~/hooks/useCommittees';
import routes from '~/routes';

const Committees = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
`;

const Committee = styled(Paper)`
  padding: 2rem;
  max-width: 15rem;
  margin: 1rem;
`;

const CommitteesList = () => {
  const committees = useCommittees();
  return (
    <Committees>
      {committees.map((committee) => (
        <Link href={routes.positions(committee.id)} key={committee.id}>
          <Committee>{committee.name}</Committee>
        </Link>
      ))}
    </Committees>
  );
};

export default CommitteesList;
