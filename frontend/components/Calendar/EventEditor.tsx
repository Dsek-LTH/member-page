import React, { useContext, useEffect, useState } from 'react';
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
import {
  EventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} from '~/generated/graphql';
import { DateTime } from 'luxon';
import UserContext from '~/providers/UserProvider';
import SuccessSnackbar from '../Snackbars/SuccessSnackbar';
import ErrorSnackbar from '../Snackbars/ErrorSnackbar';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import routes from '~/routes';
import 'react-mde/lib/styles/css/react-mde-all.css';

type BookingFormProps = {
  onSubmit?: () => void;
  eventQuery?: EventQuery;
};

export default function EditEvent({ onSubmit, eventQuery }: BookingFormProps) {
  const { t, i18n } = useTranslation(['common', 'booking', 'event']);
  const event = eventQuery?.event;
  const creatingNew = !event;
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [short_description, setShortDescription] = useState(
    event?.short_description || ''
  );
  const [startDateTime, setStartDateTime] = useState(
    event?.start_datetime
      ? DateTime.fromISO(event.start_datetime)
      : DateTime.now()
  );
  const [endDateTime, setEndDateTime] = useState(
    event?.end_datetime ? DateTime.fromISO(event.end_datetime) : DateTime.now()
  );
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const { user, loading: userLoading } = useContext(UserContext);

  const [
    createEventRequestMutation,
    {
      data: createData,
      loading: createLoading,
      error: createError,
      called: createCalled,
    },
  ] = useCreateEventMutation({
    variables: {
      title,
      description,
      short_description,
      start_datetime: startDateTime?.toISO(),
      end_datetime: endDateTime?.toISO(),
    },
  });

  const [
    updateEventRequestMutation,
    {
      data: updateEvent,
      loading: updateLoading,
      error: updateError,
      called: updateCalled,
    },
  ] = useUpdateEventMutation({
    variables: {
      id: event?.id,
      title,
      description,
      short_description,
      start_datetime: startDateTime?.toISO(),
      end_datetime: endDateTime?.toISO(),
    },
  });

  const loading = createLoading || updateLoading;
  const error = createError || updateError;
  const called = createCalled || updateCalled;

  useEffect(() => {
    if (!loading && called) {
      setErrorOpen(!!error);
      setSuccessOpen(!error);
      if (!error) {
        onSubmit?.();
        if (creatingNew) {
          Router.push(routes.calendar);
        }
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
          value={title}
          onChange={(value) => setTitle(value.target.value)}
        />
        <TextField
          label={t('event:short_description')}
          variant="outlined"
          value={short_description}
          onChange={(value) => setShortDescription(value.target.value)}
        />
        <ReactMde
          value={description}
          onChange={(value) => {
            setDescription(value);
          }}
          l18n={{
            write: t('news:write'),
            preview: t('news:preview'),
            uploadingImage: t('news:uploadingImage'),
            pasteDropSelect: t('news:pasteDropSelect'),
          }}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown source={markdown} />)
          }
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
            creatingNew
              ? createEventRequestMutation()
              : updateEventRequestMutation();
          }}
        >
          {creatingNew ? t('event:create_new_button') : t('event:save_button')}
        </Button>
      </Stack>

      <SuccessSnackbar
        open={successOpen}
        onClose={setSuccessOpen}
        message={
          creatingNew ? t('event:create_new_success') : t('event:save_success')
        }
      />
      <ErrorSnackbar
        open={errorOpen}
        onClose={setErrorOpen}
        message={
          creatingNew ? t('event:create_new_error') : t('event:save_error')
        }
      />
    </>
  );
}
