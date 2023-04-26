import AccountCircle from '@mui/icons-material/AccountCircle';
import Key from '@mui/icons-material/Key';
import LocalCafe from '@mui/icons-material/LocalCafe';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {
  Paper, Stack, styled, Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import routes from '~/routes';

const Card = styled(Stack)(({ theme }) => `
  display: flex;
  width: 100%;
  margin: 1rem;
  ${theme.breakpoints.up('md')} {
    max-width: 18rem;
  }
  width: 100%;
`);

const Pages = styled(Stack)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
  margin-right: -1rem;
`;

const Page = styled(Paper)`
  display: flex;
  padding: 2rem;
  min-width: 18rem;
`;

function VolunteerInfoList() {
  const { t } = useTranslation(['mandate']);
  return (
    <Pages>

      <Card>
        <Link href={routes.volunteerAccess} passHref>
          <MuiLink>
            <Page>
              <Key
                color="primary"
                style={{ marginRight: '1rem' }}
              />
              {t('mandate:access')}
            </Page>
          </MuiLink>
        </Link>
      </Card>

      <Card>
        <Link
          href="https://reg.dsek.se"
          target="_blank"
          rel="noopener noreferrer"
          passHref
        >
          <MuiLink>
            <Page>
              <AccountCircle
                color="primary"
                style={{ marginRight: '1rem' }}
              />
              {t('mandate:account')}
            </Page>
          </MuiLink>
        </Link>
      </Card>

      <Card>
        <Link href={routes.volunteerBenefits} passHref>
          <MuiLink>
            <Page>
              <LocalCafe
                color="primary"
                style={{ marginRight: '1rem' }}
              />
              {t('mandate:benefits')}
            </Page>
          </MuiLink>
        </Link>
      </Card>

      <Card>
        <Link href={routes.volunteerOther} passHref>
          <MuiLink>
            <Page>
              <MoreHoriz
                color="primary"
                style={{ marginRight: '1rem' }}
              />
              {t('mandate:other')}
            </Page>
          </MuiLink>
        </Link>
      </Card>

    </Pages>
  );
}

export default VolunteerInfoList;
