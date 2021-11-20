import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Tab, Tabs, TextField, useMediaQuery } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import DateTimePicker from '../DateTimePicker';
import {
  EventQuery,
  useCreateEventMutation,
  useRemoveEventMutation,
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
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

type BookingFormProps = {
  onSubmit?: () => void;
  eventQuery?: EventQuery;
};

const snackbarMessageVariation = (
  creatingNew: boolean,
  removeCalled: boolean
) => {
  if (creatingNew) {
    return 'create_new';
  } else if (removeCalled) {
    return 'remove';
  } else {
    return 'save';
  }
};

type SelectedLanguage = 'sv' | 'en';

export default function EditEvent({ onSubmit, eventQuery }: BookingFormProps) {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up('lg'));
  const { t, i18n } = useTranslation(['common', 'booking', 'event', 'news']);
  const event = eventQuery?.event;
  const creatingNew = !event;
  const [title, setTitle] = useState(event?.title || '');
  const [title_en, setTitleEn] = useState(event?.title_en || '');
  const [description, setDescription] = useState(event?.description || '');
  const [description_en, setDescriptionEn] = useState(
    event?.description_en || ''
  );
  const [short_description, setShortDescription] = useState(
    event?.short_description || ''
  );
  const [short_description_en, setShortDescriptionEn] = useState(
    event?.short_description_en || ''
  );
  const [organizer, setOrganizer] = useState(event?.organizer || '');
  const [location, setLocation] = useState(event?.location || '');
  const [link, setLink] = useState(event?.link || '');
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
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [selectedLanguage, setSelectedLanguage] =
    useState<SelectedLanguage>('sv');
  const english = selectedLanguage === 'en';
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
      title_en,
      organizer,
      location,
      link,
      description,
      description_en,
      short_description,
      short_description_en,
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
      title_en,
      organizer,
      location,
      link,
      description,
      description_en,
      short_description,
      short_description_en,
      start_datetime: startDateTime?.toISO(),
      end_datetime: endDateTime?.toISO(),
    },
  });

  const [
    removeEventRequestMutation,
    {
      data: removeEvent,
      loading: removeLoading,
      error: removeError,
      called: removeCalled,
    },
  ] = useRemoveEventMutation({
    variables: {
      id: event?.id,
    },
  });

  const loading = createLoading || updateLoading || removeLoading;
  const error = createError || updateError || removeError;
  const called = createCalled || updateCalled || removeCalled;

  useEffect(() => {
    if (!loading && called) {
      setErrorOpen(!!error);
      setSuccessOpen(!error);
      if (!error) {
        onSubmit?.();
        if (createCalled || removeCalled) {
          Router.push(routes.events);
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
        <Tabs
          value={selectedLanguage}
          onChange={(event, selectedTab: SelectedLanguage) =>
            setSelectedLanguage(selectedTab)
          }
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value="sv" label={t('swedish')} />
          <Tab value="en" label={t('english')} />
        </Tabs>
        <TextField
          label={t('booking:event')}
          variant="outlined"
          value={english ? title_en : title}
          onChange={(value) =>
            english
              ? setTitleEn(value.target.value)
              : setTitle(value.target.value)
          }
        />
        <TextField
          label={t('event:location')}
          variant="outlined"
          value={location}
          onChange={(value) => setLocation(value.target.value)}
        />
        <TextField
          label={t('event:organizer')}
          variant="outlined"
          value={organizer}
          onChange={(value) => setOrganizer(value.target.value)}
        />
        <TextField
          label={t('event:short_description')}
          variant="outlined"
          value={english ? short_description_en : short_description}
          onChange={(value) =>
            english
              ? setShortDescriptionEn(value.target.value)
              : setShortDescription(value.target.value)
          }
        />
        <ReactMde
          value={english ? description_en : description}
          selectedTab={selectedTab}
          onTabChange={(tab) => setSelectedTab(tab)}
          onChange={(value) => {
            english ? setDescriptionEn(value) : setDescription(value);
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
        <TextField
          label={t('event:link')}
          variant="outlined"
          value={link}
          onChange={(value) => setLink(value.target.value)}
        />
        <Stack direction={large ? 'row' : 'column'} spacing={3}>
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

        <Box>
          <LoadingButton
            style={{ marginRight: '1rem' }}
            loading={createLoading || updateLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            onClick={() => {
              creatingNew
                ? createEventRequestMutation()
                : updateEventRequestMutation();
            }}
          >
            {creatingNew
              ? t('event:create_new_button')
              : t('event:save_button')}
          </LoadingButton>
          <LoadingButton
            color="error"
            loading={removeLoading}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            variant="outlined"
            onClick={() => {
              if (window.confirm(t('event:remove_confirm'))) {
                removeEventRequestMutation();
              }
            }}
          >
            {t('event:remove_button')}
          </LoadingButton>
        </Box>
      </Stack>

      <SuccessSnackbar
        open={successOpen}
        onClose={setSuccessOpen}
        message={t(
          `event:${snackbarMessageVariation(creatingNew, removeCalled)}_success`
        )}
      />
      <ErrorSnackbar
        open={errorOpen}
        onClose={setErrorOpen}
        message={`event:${snackbarMessageVariation(
          creatingNew,
          removeCalled
        )}_error`}
      />
    </>
  );
}
