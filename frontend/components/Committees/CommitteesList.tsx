import { Paper, Stack, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import Link from 'next/link';
import useCommittees from '~/hooks/useCommittees';
import routes from '~/routes';
import CommitteeIcon from './CommitteeIcon';

const Card = styled(Stack)(({ theme }) => `
  display: flex;
  width: 100%;
  margin: 1rem;
  ${theme.breakpoints.up('md')} {
    max-width: 18rem;
  }
  width: 100%;
`);

const Committees = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
  margin-right: -1rem;
`;

const Committee = styled(Paper)`
  display: flex;
  padding: 2rem;
  min-width: 18rem;
`;

function CommitteesList() {
  const { committees } = useCommittees();
  return (
    <Committees>
      {committees.map((committee) => (
        <Card key={committee.id}>
          <Link href={routes.committeePage(committee.shortName)} passHref>
            <MuiLink>
              <Committee>
                <CommitteeIcon
                  name={committee.name}
                  color="primary"
                  style={{ marginRight: '1rem' }}
                />
                {committee.name}
              </Committee>
            </MuiLink>
          </Link>
        </Card>
      ))}
    </Committees>
  );
}

export default CommitteesList;
