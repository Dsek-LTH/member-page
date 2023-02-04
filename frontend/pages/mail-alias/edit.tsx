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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BuildIcon from '@mui/icons-material/Build';
import { useAllEmailsQuery } from '~/generated/graphql';
import Link from '~/components/Link';
import AddMailAliasForm from '~/components/AddMailAliasForm';
import AddSpecialSenderForm from '~/components/AddSpecialSenderForm';
import AddSpecialReceiverForm from '~/components/AddSpecialReceiverForm';

export default function EditApisPage() {
  const { t } = useTranslation();

  const { data, refetch } = useAllEmailsQuery();
  return (
    <Stack>
      <h2>{t('mailAlias:edit')}</h2>
      <AddMailAliasForm refetch={refetch} />
      <AddSpecialSenderForm refetch={refetch} />
      <AddSpecialReceiverForm refetch={refetch} />
      <Paper style={{ marginTop: '1rem' }}>
        <List>
          {data?.allEmails.map((email, index) => (
            <React.Fragment key={email}>
              <ListItem
                key={email}
                secondaryAction={(
                  <Stack direction="row" spacing={2}>
                    <Link href={`/mail-alias/${email}/edit`}>
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
                <ListItemText primary={email} />
              </ListItem>
              {index < data.allEmails.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'mailAlias'])),
  },
});
