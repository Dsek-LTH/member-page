import React from 'react';
import { useTranslation } from 'next-i18next';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { TableCell, TableCellProps } from '@mui/material';
import {
  BookingStatus,
  useAcceptBookingRequestMutation,
  useDenyBookingRequestMutation,
} from '~/generated/graphql';
import { LoadingButton } from '@mui/lab';

interface BookingTableRowProps extends TableCellProps {
  status: BookingStatus;
  bookingId: number;
  onStatusChange?: () => void;
}

export default function bookingTableModifedStatusCell({
  bookingId,
  status,
  onStatusChange,
  children,
  ...rest
}: BookingTableRowProps) {
  const { t } = useTranslation(['common, booking']);

  const [
    denyBookingRequestMutation,
    {
      data: denyData,
      loading: denyLoading,
      error: denyError,
      called: denyCalled,
    },
  ] = useDenyBookingRequestMutation({
    variables: {
      id: bookingId,
    },
  });

  const [
    acceptBookingRequestMutation,
    {
      data: acceptData,
      loading: acceptLoading,
      error: acceptError,
      called: acceptCalled,
    },
  ] = useAcceptBookingRequestMutation({
    variables: {
      id: bookingId,
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
      {(status == 'PENDING' || status == 'DENIED') && (
        <LoadingButton
          variant="text"
          onClick={accept}
          loading={acceptLoading}
          disabled={acceptLoading || denyLoading}
        >
          {t('booking:accept')}
        </LoadingButton>
      )}

      {(status == 'PENDING' || status == 'ACCEPTED') && (
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
