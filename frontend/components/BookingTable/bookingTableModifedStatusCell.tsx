import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { TableCell, TableCellProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  BookingStatus,
  useAcceptBookingRequestMutation,
  useDenyBookingRequestMutation,
  useRemoveBookingRequestMutation,
} from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';

interface BookingTableRowProps extends TableCellProps {
  status: BookingStatus;
  bookingId: number;
  onStatusChange?: () => void;
  bookerId: string;
}

export default function BookingTableModifedStatusCell({
  bookingId,
  status,
  bookerId,
  onStatusChange,
  ...rest
}: BookingTableRowProps) {
  const { t } = useTranslation(['common, booking']);
  const { showMessage } = useSnackbar();
  const apiContext = useApiAccess();
  const user = useUser();
  const [
    denyBookingRequestMutation,
    {
      loading: denyLoading,
    },
  ] = useDenyBookingRequestMutation({
    variables: {
      id: bookingId,
    },
    onCompleted: () => {
      showMessage(t('booking:requestDenied'), 'success');
    },
    onError: (error) => handleApolloError(error, showMessage, t, 'booking:bookingError'),
  });

  const [
    acceptBookingRequestMutation,
    {
      loading: acceptLoading,
    },
  ] = useAcceptBookingRequestMutation({
    variables: {
      id: bookingId,
    },
    onCompleted: () => {
      showMessage(t('booking:requestAccepted'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'booking:bookingError');
    },
  });

  const [
    removeBookingRequest,
    {
      loading: removeLoading,
    },
  ] = useRemoveBookingRequestMutation({
    variables: {
      id: bookingId,
    },
    onCompleted: () => {
      showMessage(t('booking:requestRemoved'), 'success');
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'booking:bookingError');
    },
  });

  const accept = async () => {
    await acceptBookingRequestMutation();
    onStatusChange?.();
  };

  const deny = async () => {
    await denyBookingRequestMutation();
    onStatusChange?.();
  };

  const remove = async () => {
    await removeBookingRequest();
    onStatusChange?.();
  };

  return (
    <TableCell {...rest}>
      {(status === 'PENDING' || status === 'DENIED') && hasAccess(apiContext, 'booking_request:update') && (
        <LoadingButton
          variant="text"
          onClick={accept}
          loading={acceptLoading}
          disabled={acceptLoading || denyLoading || removeLoading}
        >
          {t('booking:accept')}
        </LoadingButton>
      )}

      {(status === 'PENDING' || status === 'ACCEPTED') && hasAccess(apiContext, 'booking_request:update') && (
        <LoadingButton
          variant="text"
          onClick={deny}
          loading={denyLoading}
          disabled={acceptLoading || denyLoading || removeLoading}
        >
          {t('booking:deny')}
        </LoadingButton>
      )}
      {(hasAccess(apiContext, 'booking_request:delete') || bookerId === user.user.id) && (
        <LoadingButton
          variant="text"
          onClick={remove}
          loading={removeLoading}
          disabled={acceptLoading || denyLoading || removeLoading}
        >
          {t('booking:remove')}
        </LoadingButton>
      )}
    </TableCell>
  );
}
