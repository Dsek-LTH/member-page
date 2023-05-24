import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BuildIcon from '@mui/icons-material/Build';
import
{
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import AddAccessPolicyForm from '~/components/AddAccessPolicyForm';
import Link from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetApisQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function EditApisPage() {
  useSetPageName('Edit API access');
  const { t } = useTranslation();

  const { data, refetch } = useGetApisQuery();
  return (
    <Stack>
      <PageHeader>{t('policy:editApiAccess')}</PageHeader>
      <AddAccessPolicyForm isDoor={false} refetch={refetch} />
      <Paper style={{ marginTop: '1rem' }}>
        <List>
          {data?.apis.map((api, index) => (
            <React.Fragment key={api.name}>
              <ListItem
                key={api.name}
                secondaryAction={(
                  <Stack direction="row" spacing={2}>
                    <Link href={`/apis/${api.name}/edit`}>
                      <IconButton edge="end">
                        <BuildIcon />
                      </IconButton>
                    </Link>
                  </Stack>
                )}
              >
                <ListItemIcon>
                  <AutoFixHighIcon />
                </ListItemIcon>
                <ListItemText primary={api.name} />
              </ListItem>
              {index < data.apis.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}

export const getStaticProps = genGetProps(['policy']);
