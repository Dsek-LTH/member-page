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
import { useGetMailAliasesQuery } from '~/generated/graphql';
import Link from '~/components/Link';
import AddMailAliasForm from '~/components/AddMailAliasForm';

export default function EditApisPage() {
  const { t } = useTranslation();

  const { data, refetch } = useGetMailAliasesQuery();
  return (
    <Stack>
      <h2>{t('mailAlias:edit')}</h2>
      <Paper>
        <List>
          {data?.aliases.map((alias, index) => (
            <React.Fragment key={alias.email}>
              <ListItem
                key={alias.email}
                secondaryAction={(
                  <Stack direction="row" spacing={2}>
                    <Link href={`/mail-alias/${alias.email}/edit`}>
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
                <ListItemText primary={alias.email} />
              </ListItem>
              {index < data.aliases.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <AddMailAliasForm refetch={refetch} />
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'mailAlias'])),
  },
});
