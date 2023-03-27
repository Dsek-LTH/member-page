import { Paper, Stack, styled } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import MandateInfoIcon from '~/components/Mandates/MandateInfoIcon';
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
const urls = ['access', 'account', 'benefits', 'other'];

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

function MandateInfo() {
  const { t } = useTranslation(['mandate']);
  return (
    <Pages>
      {urls.map((url) => (
        <Card key={url}>
          <Link href={routes.mandateInfo(url)} passHref>
            <Page>
              <MandateInfoIcon
                name={url}
                color="primary"
                style={{ marginRight: '1rem' }}
              />
              {t(`mandate:${url}`)}
            </Page>
          </Link>
        </Card>
      ))}
    </Pages>
  );
}

export default MandateInfo;
