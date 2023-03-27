import DeleteIcon from '@mui/icons-material/Delete';
import
{
  Breadcrumbs, Checkbox, Divider, FormControlLabel, IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import AddMailAliasForm from '~/components/AddMailAliasForm';
import AddSpecialReceiverForm from '~/components/AddSpecialReceiverForm';
import AddSpecialSenderForm from '~/components/AddSpecialSenderForm';
import BreadcrumbLayout from '~/components/BreadcrumbLayout';
import ConfirmDialog from '~/components/ConfirmDialog';
import Link from '~/components/Link';
import genGetProps from '~/functions/genGetServerSideProps';
import
{
  useGetMailAliasQuery,
  useRemoveMailAliasMutation,
  useRemoveSpecialReceiverMutation,
  useRemoveSpecialSenderMutation,
  useSpecialReceiversQuery,
  useSpecialSendersQuery,
  useUpdateSenderStatusMutation,
} from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import routes from '~/routes';

export default function EditDoorPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const email = router.query.email as string;

  const [openDialog, setOpenDialog] = useState<string>(null);

  const { data, refetch, loading } = useGetMailAliasQuery({
    variables: { email },
  });
  const {
    data: specialSendersData,
    refetch: refetchSpecialSenders,
    loading: loadingSpecialSenders,
  } = useSpecialSendersQuery({
    variables: { alias: email },
  });

  const {
    data: specialReceiversData,
    refetch: refetchSpecialReceivers,
    loading: loadingSpecialReceivers,
  } = useSpecialReceiversQuery({
    variables: { alias: email },
  });

  const [removeMailAlias] = useRemoveMailAliasMutation();
  const [removeSpecialSender] = useRemoveSpecialSenderMutation();
  const [removeSpecialReceiver] = useRemoveSpecialReceiverMutation();
  const [updateCanSend] = useUpdateSenderStatusMutation();
  const { hasAccess } = useApiAccess();
  const { showMessage } = useSnackbar();
  return (
    <BreadcrumbLayout
      breadcrumbsChildren={[
        <Link underline="hover" href={routes.mailAlias} key="bc-1">
          mail-alias
        </Link>,
        <Typography color="text.primary" key="bc-2">
          {email}
        </Typography>,
      ]}
    >
      <Breadcrumbs aria-label="breadcrumb" />
      <AddMailAliasForm refetch={refetch} email={email} />
      <AddSpecialSenderForm refetch={refetchSpecialSenders} email={email} />
      <AddSpecialReceiverForm refetch={refetchSpecialReceivers} email={email} />
      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h5" component="h2">
          {t('mailAlias:policies')}
        </Typography>
        <List>
          {data?.alias?.policies.map((policy) => (
            <React.Fragment key={policy.id}>
              <ConfirmDialog
                open={openDialog === policy.id}
                setOpen={() => {
                  setOpenDialog(null);
                }}
                handler={(value) => {
                  if (value) {
                    removeMailAlias({
                      variables: { id: policy.id },
                    }).then(() => {
                      refetch();
                    });
                  }
                }}
              >
                Are you sure you want to delete
                {' '}
                {policy.position.id}
                ?
              </ConfirmDialog>
              {' '}
              <ListItem
                style={{ paddingLeft: 0 }}
                secondaryAction={(
                  <>
                    {hasAccess('core:mail:alias:update') && (
                    <FormControlLabel
                      onClick={() => {
                        updateCanSend({
                          variables: {
                            input: [{
                              id: policy.id,
                              canSend: !policy.canSend,
                            }],
                          },
                        }).then(() => {
                          refetch();
                          showMessage('Updated', 'success');
                        });
                      }}
                      control={<Checkbox checked={policy.canSend} />}
                      label="Can send"
                    />
                    )}

                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setOpenDialog(policy.id);
                      }}
                    >

                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              >
                <ListItemText>
                  {policy.position.name}
                  :
                  {' '}
                  {policy.position.id}
                </ListItemText>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {!loading && !data?.alias?.policies.length && (
            <Typography>{t('mailAlias:noPolicies')}</Typography>
          )}
        </List>
      </Paper>

      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h5" component="h2">
          Special Senders
        </Typography>
        <List>
          {specialSendersData?.specialSenders.map((sender) => (
            <React.Fragment key={sender.id}>
              <ConfirmDialog
                open={openDialog === sender.id}
                setOpen={() => {
                  setOpenDialog(null);
                }}
                handler={(value) => {
                  if (value) {
                    removeSpecialSender({
                      variables: { id: sender.id },
                    }).then(() => {
                      refetchSpecialSenders();
                    });
                  }
                }}
              >
                Are you sure you want to delete
                {' '}
                {sender.studentId}
                {' '}
                as a special sender
                ?
              </ConfirmDialog>
              {' '}
              <ListItem
                style={{ paddingLeft: 0 }}
                secondaryAction={(
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      setOpenDialog(sender.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              >
                <ListItemText>
                  {sender.studentId}
                  :
                  {' '}
                  {sender.keycloakId}
                </ListItemText>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {!loadingSpecialSenders && specialSendersData?.specialSenders.length === 0 && (
            <Typography>
              {email}
              {' '}
              has no special senders
            </Typography>
          )}
        </List>
      </Paper>

      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h5" component="h2">
          Special Receivers
        </Typography>
        <List>
          {specialReceiversData?.specialReceivers.map((receiver) => (
            <React.Fragment key={receiver.id}>
              <ConfirmDialog
                open={openDialog === receiver.id}
                setOpen={() => {
                  setOpenDialog(null);
                }}
                handler={(value) => {
                  if (value) {
                    removeSpecialReceiver({
                      variables: { id: receiver.id },
                    }).then(() => {
                      refetchSpecialReceivers();
                    });
                  }
                }}
              >
                Are you sure you want to delete
                {' '}
                {receiver.targetEmail}
                {' '}
                as a special receiver
                ?
              </ConfirmDialog>
              {' '}
              <ListItem
                style={{ paddingLeft: 0 }}
                secondaryAction={(
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      setOpenDialog(receiver.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              >
                <ListItemText>
                  {receiver.targetEmail}
                </ListItemText>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {!loadingSpecialReceivers && specialReceiversData?.specialReceivers.length === 0 && (
            <Typography>
              {email}
              {' '}
              has no special receivers
            </Typography>
          )}
        </List>
      </Paper>
    </BreadcrumbLayout>
  );
}

export const getServerSideProps = genGetProps(['mailAlias']);
