import {
  Breadcrumbs,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
  AccessPolicy,
  useGetApiQuery,
  useRemoveAccessPolicyMutation,
} from '~/generated/graphql';
import Link from '~/components/Link';
import BreadcrumbLayout from '~/components/BreadcrumbLayout';
import YesNoDialog from '~/components/YesNoDialog';
import AddAccessPolicyForm from '~/components/AddAccessPolicyForm';
import fromIsoToShortDate from '~/functions/fromIsoToShortDate';

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
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const name = router.query.policy as string;

  const [openDialog, setOpenDialog] = useState<string>(null);

  const {
    data,
    refetch: refetchPolicy,
    loading,
  } = useGetApiQuery({ variables: { name } });
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
      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h5" component="h2">
          {t('policy:accessPolicies')}
        </Typography>
        <List>
          {data?.api.accessPolicies.map((accessPolicy) => (
            <React.Fragment key={accessPolicy.id}>
              <YesNoDialog
                open={openDialog === accessPolicy.id}
                setOpen={() => {
                  setOpenDialog(null);
                }}
                handleYes={() => {
                  removeAccessPolicy({
                    variables: { id: accessPolicy.id },
                  }).then(() => {
                    refetchPolicy();
                  });
                }}
              >
                Are you sure you want to delete
                {' '}
                {accessPolicy.accessor}
                ?
              </YesNoDialog>
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
          {!loading && data?.api.accessPolicies.length === 0 && (
            <Typography>{t('policy:noAccessPolicies')}</Typography>
          )}
        </List>
      </Paper>
      <AddAccessPolicyForm name={name} isDoor={false} />
    </BreadcrumbLayout>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'policy'])),
  },
});
