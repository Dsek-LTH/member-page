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
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetApisQuery } from '~/generated/graphql';

export default function EditApisPage() {
  const { t } = useTranslation();

  const { data, refetch } = useGetApisQuery();
  return (
    <Stack>
      <h2>{t('policy:editApiAccess')}</h2>
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
