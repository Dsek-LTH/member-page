import Link from '~/components/Link';
import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useCommittees } from '~/hooks/useCommittees';
import routes from '~/routes';
import { CommitteeIcon } from './CommitteeIcon';

const Committees = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
  margin-right: -1rem;
`;

const Committee = styled(Paper)(
  ({ theme }) => `
  display: flex;
  padding: 2rem;
  min-width: 18rem;
  ${theme.breakpoints.up('md')} {
    max-width: 18rem;
  }
  width: 100%;
  margin: 1rem;
`
);

const CommitteesList = () => {
  const committees = useCommittees();
  return (
    <Committees>
      {committees.map((committee) => (
        <Link href={routes.positions(committee.id)} key={committee.id}>
          <Committee>
            <CommitteeIcon
              name={committee.name}
              color="primary"
              style={{ marginRight: '1rem' }}
            />
            {committee.name}
          </Committee>
        </Link>
      ))}
    </Committees>
  );
};

export default CommitteesList;
