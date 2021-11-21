import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Autocomplete,
  Chip,
  TextField,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import DateTimePicker from '../DateTimePicker';
import { useCreateBookingRequestMutation, useGetBookablesQuery } from '~/generated/graphql';
import { DateTime } from 'luxon';
import UserContext from '~/providers/UserProvider';
import SuccessSnackbar from '../Snackbars/SuccessSnackbar';
import ErrorSnackbar from '../Snackbars/ErrorSnackbar';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

type BookingFormProps = {
  onSubmit?: () => void;
};

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const { t, i18n } = useTranslation(['common, booking']);
  const english = i18n.language === 'en';
  const [event, setEvent] = React.useState('');
  const [startDateTime, setStartDateTime] = React.useState(DateTime.now());
  const [endDateTime, setEndDateTime] = React.useState(DateTime.now());
  const [bookables, setBookables] = React.useState<string[]>([]);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const { user, loading: userLoading } = useContext(UserContext);

  const { data: bookableData, loading: bookableLoading } = useGetBookablesQuery();

  const [createBookingRequestMutation, { data, loading, error, called }] =
    useCreateBookingRequestMutation({
      variables: {
        bookerId: user?.id,
        start: startDateTime.toISO(),
        end: endDateTime.toISO(),
        what: bookableData?.bookables.filter(bookable => bookables.includes(english ? bookable.name_en : bookable.name)).map(bookable => bookable.id),
        event: event,
      },
    });

  useEffect(() => {
    if (!loading && called) {
      if (error) {
        setErrorOpen(true);
        setSuccessOpen(false);
      } else {
        setErrorOpen(false);
        setSuccessOpen(true);
        onSubmit?.();
      }
    } else {
      setSuccessOpen(false);
      setErrorOpen(false);
    }
  }, [loading]);

  if (userLoading || bookableLoading) {
    return <></>;
  }

  return (
    <>
      <Stack spacing={2}>
        <TextField
          label={t('booking:event')}
          variant="outlined"
          onChange={(value) => setEvent(value.target.value)}
        />

        <Autocomplete
          multiple
          id="fixed-tags-demo"
          value={bookables}
          onChange={(event, newValue) => {
            setBookables(newValue);
          }}
          options={bookableData.bookables.map(bookable => english ? bookable.name_en : bookable.name)}
          getOptionLabel={(option) => option}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label={t('booking:what')} />
          )}
        />

        <Stack direction="row" spacing={3}>
          <DateTimePicker
            dateTime={startDateTime}
            setDateTime={setStartDateTime}
            timeLabel={t('booking:startTime')}
            dateLabel={t('booking:startDate')}
          />
          <DateTimePicker
            dateTime={endDateTime}
            setDateTime={setEndDateTime}
            timeLabel={t('booking:endTime')}
            dateLabel={t('booking:endDate')}
          />
        </Stack>

        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={() => {
            createBookingRequestMutation();
          }}
        >
          {t('booking:submit')}
        </LoadingButton>
      </Stack>

      <SuccessSnackbar
        open={successOpen}
        onClose={setSuccessOpen}
        message={t('booking:bookingCreated')}
      />
      <ErrorSnackbar
        open={errorOpen}
        onClose={setErrorOpen}
        message={t('booking:bookingError')}
      />
    </>
  );
}
