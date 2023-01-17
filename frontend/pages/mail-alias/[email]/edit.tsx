import {
  Breadcrumbs,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  useGetMailAliasQuery,
  useRemoveMailAliasMutation,
  useUpdateSenderStatusMutation,
} from '~/generated/graphql';
import Link from '~/components/Link';
import BreadcrumbLayout from '~/components/BreadcrumbLayout';
import ConfirmDialog from '~/components/ConfirmDialog';
import routes from '~/routes';
import AddMailAliasForm from '~/components/AddMailAliasForm';

export default function EditDoorPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const email = router.query.email as string;

  const [openDialog, setOpenDialog] = useState<string>(null);

  const { data, refetch, loading } = useGetMailAliasQuery({
    variables: { email },
  });
  const [removeMailAlias] = useRemoveMailAliasMutation();
  const [updateCanSend] = useUpdateSenderStatusMutation();

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
      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h5" component="h2">
          {t('mailAlias:policies')}
        </Typography>
        <List>
          {data?.alias.policies.map((policy) => (
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
                        });
                      }}
                      control={<Checkbox checked={policy.canSend} />}
                      label="Can send"
                    />
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
          {!loading && data?.alias.policies.length === 0 && (
            <Typography>{t('mailAlias:noPolicies')}</Typography>
          )}
        </List>
      </Paper>
      <AddMailAliasForm refetch={refetch} email={email} />
    </BreadcrumbLayout>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'mailAlias'])),
  },
});
