import DeleteIcon from '@mui/icons-material/Delete';
import
{
  Breadcrumbs,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import AddAccessPolicyForm from '~/components/AddAccessPolicyForm';
import BreadcrumbLayout from '~/components/BreadcrumbLayout';
import ConfirmDialog from '~/components/ConfirmDialog';
import Link from '~/components/Link';
import fromIsoToShortDate from '~/functions/fromIsoToShortDate';
import genGetProps from '~/functions/genGetServerSideProps';
import
{
  AccessPolicy,
  useGetDoorQuery,
  useRemoveAccessPolicyMutation,
} from '~/generated/graphql';

const accessPolicyToString = (
  accessPolicy: AccessPolicy,
  locale: string,
): string => {
  if (accessPolicy.start_datetime && accessPolicy.end_datetime) {
    return `${accessPolicy.accessor}, ${fromIsoToShortDate(
      accessPolicy.start_datetime,
      locale,
    )} - ${fromIsoToShortDate(accessPolicy.end_datetime, locale)}`;
  }
  return accessPolicy.accessor;
};

export default function EditDoorPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const name = router.query.doorName as string;

  const [openDialog, setOpenDialog] = useState<string>(null);

  const {
    data,
    refetch: refetchDoor,
    loading,
  } = useGetDoorQuery({ variables: { name }, fetchPolicy: 'no-cache' });
  const [removeAccessPolicy] = useRemoveAccessPolicyMutation();

  return (
    <BreadcrumbLayout
      breadcrumbsChildren={[
        <Link underline="hover" href="/doors/edit" key="bc-1">
          doors
        </Link>,
        <Typography color="text.primary" key="bc-2">
          {name}
        </Typography>,
      ]}
    >
      <Breadcrumbs aria-label="breadcrumb" />
      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h5" component="h2">
          {t('policy:accessPolicies')}
        </Typography>
        <List>
          {data?.door.accessPolicies.map((accessPolicy) => (
            <React.Fragment key={accessPolicy.id}>
              <ConfirmDialog
                open={openDialog === accessPolicy.id}
                setOpen={() => {
                  setOpenDialog(null);
                }}
                handler={(value) => {
                  if (value) {
                    removeAccessPolicy({
                      variables: { id: accessPolicy.id },
                    }).then(() => {
                      refetchDoor();
                    });
                  }
                }}
              >
                Are you sure you want to delete
                {' '}
                {accessPolicy.accessor}
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
                      setOpenDialog(accessPolicy.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              >
                <ListItemText>
                  {accessPolicyToString(accessPolicy, i18n.language)}
                </ListItemText>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {!loading && data?.door.accessPolicies.length === 0 && (
            <Typography>{t('doors:noAccessPolicies')}</Typography>
          )}
        </List>
      </Paper>
      <AddAccessPolicyForm name={name} refetch={refetchDoor} isDoor />
    </BreadcrumbLayout>
  );
}

export const getServerSideProps = genGetProps(['policy', 'doors']);
