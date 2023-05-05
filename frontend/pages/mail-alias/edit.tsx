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
import AddMailAliasForm from '~/components/AddMailAliasForm';
import AddSpecialReceiverForm from '~/components/AddSpecialReceiverForm';
import AddSpecialSenderForm from '~/components/AddSpecialSenderForm';
import Link from '~/components/Link';
import genGetProps from '~/functions/genGetServerSideProps';
import { useAllEmailsQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function EditApisPage() {
  const { t } = useTranslation();
  useSetPageName(t('mailAlias:edit'));

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

export const getServerSideProps = genGetProps(['mailAlias']);
