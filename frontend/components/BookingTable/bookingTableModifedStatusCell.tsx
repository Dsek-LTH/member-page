import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { TableCell, TableCellProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  BookingStatus,
  useAcceptBookingRequestMutation,
  useDenyBookingRequestMutation,
} from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

interface BookingTableRowProps extends TableCellProps {
  status: BookingStatus;
  bookingId: number;
  onStatusChange?: () => void;
}

export default function BookingTableModifedStatusCell({
  bookingId,
  status,
  onStatusChange,
  ...rest
}: BookingTableRowProps) {
  const { t } = useTranslation(['common, booking']);
  const { showMessage } = useSnackbar();

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

  const accept = async () => {
    await acceptBookingRequestMutation();
    onStatusChange?.();
  };

  const deny = async () => {
    await denyBookingRequestMutation();
    onStatusChange?.();
  };

  return (
    <TableCell {...rest}>
      {(status === 'PENDING' || status === 'DENIED') && (
        <LoadingButton
          variant="text"
          onClick={accept}
          loading={acceptLoading}
          disabled={acceptLoading || denyLoading}
        >
          {t('booking:accept')}
        </LoadingButton>
      )}

      {(status === 'PENDING' || status === 'ACCEPTED') && (
        <LoadingButton
          variant="text"
          onClick={deny}
          loading={denyLoading}
          disabled={acceptLoading || denyLoading}
        >
          {t('booking:deny')}
        </LoadingButton>
      )}
    </TableCell>
  );
}
