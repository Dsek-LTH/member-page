import { Paper, Stack, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import useCommittees from '~/hooks/useCommittees';
import routes from '~/routes';
import CommitteeIcon from './CommitteeIcon';

const Card = styled(Stack)`
  display: flex;
  width: 100%;
  width: 100%;
`;

const Committees = styled(Stack)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
`;

const Committee = styled(Paper)`
  display: flex;
  padding: 2rem;
  min-width: 18rem;
`;

function CommitteesList() {
  const { committees } = useCommittees();
  const { i18n } = useTranslation('common');

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
                {selectTranslation(i18n, committee.name, committee?.name_en)}
              </Committee>
            </MuiLink>
          </Link>
        </Card>
      ))}
    </Committees>
  );
}

export default CommitteesList;
