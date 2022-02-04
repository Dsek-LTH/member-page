import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { Autocomplete, Chip, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { DateTime } from 'luxon';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DateTimePicker from '../DateTimePicker';
import {
  useCreateBookingRequestMutation,
  useGetBookablesQuery,
} from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

type BookingFormProps = {
  onSubmit?: () => void;
};

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const { t, i18n } = useTranslation(['common, booking']);
  const english = i18n.language === 'en';
  const [event, setEvent] = React.useState('');
  const [startDateTime, setStartDateTime] = React.useState(DateTime.now());
  const [endDateTime, setEndDateTime] = React.useState(DateTime.now().plus({ hours: 8 }));
  const [bookables, setBookables] = React.useState<string[]>([]);
  const { user, loading: userLoading } = useContext(UserContext);

  const { data: bookableData, loading: bookableLoading } = useGetBookablesQuery();
  const { showMessage } = useSnackbar();

  const [createBookingRequestMutation, { loading }] = useCreateBookingRequestMutation({
    variables: {
      bookerId: user?.id,
      start: startDateTime.toISO(),
      end: endDateTime.toISO(),
      what: bookableData?.bookables
        .filter((bookable) =>
          bookables.includes(english ? bookable.name_en : bookable.name))
        .map((bookable) => bookable.id),
      event,
    },
    onCompleted: () => {
      showMessage(t('booking:bookingCreated'), 'success');
      onSubmit?.();
    },
    onError: (error) => {
      handleApolloError(error, showMessage, t, 'booking:bookingError');
    },
  });

  if (userLoading || bookableLoading) {
    return null;
  }

  return (
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
        onChange={(_, newValue) => {
          setBookables(newValue);
        }}
        options={bookableData.bookables.map((bookable) =>
          (english ? bookable.name_en : bookable.name))}
        getOptionLabel={(option) => option}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip key={option} label={option} {...getTagProps({ index })} />
          ))}
        renderInput={(params) => (
          <TextField {...params} label={t('booking:what')} />
        )}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
      >
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
  );
}
