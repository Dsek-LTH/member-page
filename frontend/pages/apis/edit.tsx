import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BuildIcon from '@mui/icons-material/Build';
import { useGetApisQuery } from '~/generated/graphql';
import Link from '~/components/Link';
import AddAccessPolicyForm from '~/components/AddAccessPolicyForm';

export default function EditApisPage() {
  const { t } = useTranslation();

  const { data } = useGetApisQuery();
  return (
    <Stack>
      <h2>{t('policy:editApiAccess')}</h2>
      <Paper>
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
      <AddAccessPolicyForm isDoor={false} />
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['policy', 'common'])),
  },
});
