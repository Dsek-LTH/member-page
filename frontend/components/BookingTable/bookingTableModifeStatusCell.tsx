import React from 'react';
import { useTranslation } from 'next-i18next';
import "react-mde/lib/styles/css/react-mde-all.css";
import { TableCell, TableCellProps } from '@material-ui/core';
import { BookingStatus, useAcceptBookingRequestMutation, useDenyookingRequestMutation } from '~/generated/graphql';
import { LoadingButton } from '@material-ui/lab';

interface BookingTableRowProps extends TableCellProps {
  status: BookingStatus,
  bookingId: number,
  onStatusChange?: () => void
}

export default function BookingTableModifeStatusCell({ bookingId, status, onStatusChange, children, ...rest }: BookingTableRowProps) {
  const { t } = useTranslation(['common, booking']);

  const [denyookingRequestMutation, { data: denyData, loading: denyLoading, error: denyError, called: denyCalled }] = useDenyookingRequestMutation({
    variables: {
      id: bookingId
    },
  });

  const [acceptBookingRequestMutation, { data: acceptData, loading: acceptLoading, error: acceptError, called: acceptCalled }] = useAcceptBookingRequestMutation({
    variables: {
      id: bookingId
    },
  });

  const accept = async () => {
    await acceptBookingRequestMutation()
    onStatusChange?.();
  }

  const deny = async () => {
    await denyookingRequestMutation();
    onStatusChange?.();
  }

  return (

    <TableCell  {...rest} >
      {(status == "PENDING" || status == "DENIED") &&
        <LoadingButton
          variant="text"
          onClick={accept}
          loading={acceptLoading}
          disabled={acceptLoading || denyLoading}
        >
          {t('booking:accept')}
        </LoadingButton>
      }

      {(status == "PENDING" || status == "ACCEPTED") &&
        <LoadingButton
          variant="text"
          onClick={deny}
          loading={denyLoading}
          disabled={acceptLoading || denyLoading}
        >
          {t('booking:deny')}
            </LoadingButton>
      }
    </TableCell>
  )
}