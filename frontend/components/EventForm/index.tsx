import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import DateTimePicker from '../DateTimePicker';
import { useCreateBookingRequestMutation } from '~/generated/graphql';
import { DateTime } from 'luxon';
import UserContext from '~/providers/UserProvider';
import SuccessSnackbar from '../Snackbars/SuccessSnackbar';
import ErrorSnackbar from '../Snackbars/ErrorSnackbar';

type BookingFormProps = {
  onSubmit?: () => void;
};

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const { t, i18n } = useTranslation(['common', 'booking', 'event']);
  const [event, setEvent] = React.useState('');
  const [startDateTime, setStartDateTime] = React.useState(DateTime.now());
  const [endDateTime, setEndDateTime] = React.useState(DateTime.now());
  const [checkBoxItems, setCheckBoxItems] = React.useState<string[]>([]);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const what = checkBoxItems.join(', ');
  const { user, loading: userLoading } = useContext(UserContext);

  const [createBookingRequestMutation, { data, loading, error, called }] =
    useCreateBookingRequestMutation({
      variables: {
        bookerId: user?.id,
        start: startDateTime?.toISO(),
        end: endDateTime?.toISO(),
        what: what,
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

  if (userLoading) {
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
        <TextField
          label={t('event:short_description')}
          variant="outlined"
          onChange={(value) => setEvent(value.target.value)}
        />
        <TextField
          label={t('event:description')}
          variant="outlined"
          multiline
          onChange={(value) => setEvent(value.target.value)}
          minRows={4}
        />
        <Box>
          <DateTimePicker
            dateTime={startDateTime}
            setDateTime={setStartDateTime}
            timeLabel={t('booking:startTime')}
            dateLabel={t('booking:startDate')}
          />
        </Box>
        <Box>
          <DateTimePicker
            dateTime={endDateTime}
            setDateTime={setEndDateTime}
            timeLabel={t('booking:endTime')}
            dateLabel={t('booking:endDate')}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            createBookingRequestMutation();
          }}
        >
          {t('booking:submit')}
        </Button>
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
