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
  useGetApiQuery,
  useRemoveAccessPolicyMutation,
} from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

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

export default function EditApiPage() {
  useSetPageName('Edit API access');
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const name = router.query.policy as string;

  const [openDialog, setOpenDialog] = useState<string>(null);

  const {
    data,
    refetch: refetchPolicy,
    loading,
  } = useGetApiQuery({ variables: { name }, fetchPolicy: 'no-cache' });
  const [removeAccessPolicy] = useRemoveAccessPolicyMutation();
  return (
    <BreadcrumbLayout
      breadcrumbsChildren={[
        <Link underline="hover" href="/apis/edit" key="bc-1">
          apis
        </Link>,
        <Typography color="text.primary" key="bc-2">
          {name}
        </Typography>,
      ]}
    >
      <Breadcrumbs aria-label="breadcrumb" />
      <AddAccessPolicyForm name={name} isDoor={false} refetch={refetchPolicy} />
      <Paper style={{ padding: '1rem', marginTop: '1rem' }}>
        <Typography variant="h5" component="h2">
          {t('policy:accessPolicies')}
        </Typography>
        <List>
          {data?.api?.accessPolicies.map((accessPolicy) => (
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
                      refetchPolicy();
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
          {!loading && data?.api?.accessPolicies?.length === 0 && (
            <Typography>{t('policy:noAccessPolicies')}</Typography>
          )}
        </List>
      </Paper>
    </BreadcrumbLayout>
  );
}

export const getServerSideProps = genGetProps(['policy']);
