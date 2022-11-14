/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Box, Tab, Tabs, TextField, useMediaQuery,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { DateTime } from 'luxon';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import UserContext, { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import {
  EventQuery,
  useCreateEventMutation,
  useGetUploadDataMutation,
  useRemoveEventMutation,
  useUpdateEventMutation,
} from '~/generated/graphql';
import DateTimePicker from '../DateTimePicker';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import { authorIsUser } from '~/functions/authorFunctions';
import putFile from '~/functions/putFile';
import Link from '../Link';

type BookingFormProps = {
  onSubmit?: () => void;
  eventQuery?: EventQuery;
};

const snackbarMessageVariation = (
  creatingNew: boolean,
  removeCalled: boolean,
) => {
  if (creatingNew) {
    return 'create_new';
  } if (removeCalled) {
    return 'remove';
  }
  return 'save';
};

type SelectedLanguage = 'sv' | 'en';

export default function EditEvent({ onSubmit, eventQuery }: BookingFormProps) {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up('lg'));
  const { t } = useTranslation(['common', 'booking', 'event', 'news']);
  const event = eventQuery?.event;
  const creatingNew = !event;
  const [fileName, setFileName] = React.useState('');
  const [title, setTitle] = useState(event?.title || '');
  const [titleEn, setTitleEn] = useState(event?.title_en || '');
  const [description, setDescription] = useState(event?.description || '');
  const [descriptionEn, setDescriptionEn] = useState(
    event?.description_en || '',
  );
  const [shortDescription, setShortDescription] = useState(
    event?.short_description || '',
  );
  const [shortDescriptionEn, setShortDescriptionEn] = useState(
    event?.short_description_en || '',
  );
  const [organizer, setOrganizer] = useState(event?.organizer || '');
  const [location, setLocation] = useState(event?.location || '');
  const [link, setLink] = useState(event?.link || '');
  const [startDateTime, setStartDateTime] = useState(
    event?.start_datetime
      ? DateTime.fromISO(event.start_datetime)
      : DateTime.now(),
  );
  const [endDateTime, setEndDateTime] = useState(
    event?.end_datetime ? DateTime.fromISO(event.end_datetime) : DateTime.now(),
  );
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [selectedLanguage, setSelectedLanguage] = useState<SelectedLanguage>('sv');
  const english = selectedLanguage === 'en';
  const { loading: userLoading } = useContext(UserContext);
  const apiContext = useApiAccess();
  const { showMessage } = useSnackbar();
  const { user } = useUser();
  const onComplete = () => {
    showMessage(
      t(`event:${snackbarMessageVariation(creatingNew, removeCalled)}_success`),
      'success',
    );
    onSubmit?.();
    if (createCalled || removeCalled) {
      Router.push(routes.events);
    }
  };

  const [
    createEventRequestMutation,
    {
      loading: createLoading,
      called: createCalled,
    },
  ] = useCreateEventMutation({
    variables: {
      title,
      title_en: titleEn,
      organizer,
      location,
      link,
      description,
      description_en: descriptionEn,
      short_description: shortDescription,
      short_description_en: shortDescriptionEn,
      start_datetime: startDateTime?.toISO(),
      end_datetime: endDateTime?.toISO(),
    },
    onCompleted: () => onComplete(),
    onError: (error) => handleApolloError(error, showMessage, t, `event:${snackbarMessageVariation(creatingNew, removeCalled)}_error`),
  });

  const [
    updateEventRequestMutation,
    {
      loading: updateLoading,
    },
  ] = useUpdateEventMutation({
    variables: {
      id: event?.id,
      title,
      title_en: titleEn,
      organizer,
      location,
      link,
      description,
      description_en: descriptionEn,
      short_description: shortDescription,
      short_description_en: shortDescriptionEn,
      start_datetime: startDateTime?.toISO(),
      end_datetime: endDateTime?.toISO(),
    },
    onCompleted: () => onComplete(),
    onError: (error) => handleApolloError(error, showMessage, t, `event:${snackbarMessageVariation(creatingNew, removeCalled)}_error`),
  });

  const [
    removeEventRequestMutation,
    {
      loading: removeLoading,
      called: removeCalled,
    },
  ] = useRemoveEventMutation({
    variables: {
      id: event?.id,
    },
    onCompleted: () => onComplete(),
    onError: (error) => handleApolloError(error, showMessage, t, `event:${snackbarMessageVariation(creatingNew, removeCalled)}_error`),
  });

  const [getUploadData] = useGetUploadDataMutation({
    variables: {
      header: title,
      fileName,
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });

  const saveImage = async function* (_, file: File) {
    setFileName(`${uuidv4()}.${file.name.split('.').pop()}`);

    const data = await getUploadData();
    putFile(data.data.article.getUploadData.uploadUrl, file, file.type, showMessage, t);

    yield data.data.article.getUploadData.uploadUrl.split('?')[0];
    return true;
  };

  if (userLoading) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Tabs
        value={selectedLanguage}
        onChange={(_, selectedLang: SelectedLanguage) =>
          setSelectedLanguage(selectedLang)}
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
        value={english ? titleEn : title}
        onChange={(value) =>
          (english
            ? setTitleEn(value.target.value)
            : setTitle(value.target.value))}
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
        value={english ? shortDescriptionEn : shortDescription}
        onChange={(value) =>
          (english
            ? setShortDescriptionEn(value.target.value)
            : setShortDescription(value.target.value))}
      />
      <Link newTab href="https://www.markdownguide.org/cheat-sheet/">{t('news:markdown_guide')}</Link>
      <ReactMde
        value={english ? descriptionEn : description}
        selectedTab={selectedTab}
        onTabChange={(tab) => setSelectedTab(tab)}
        onChange={(value) => {
          if (english) setDescriptionEn(value);
          else setDescription(value);
        }}
        l18n={{
          write: t('news:write'),
          preview: t('news:preview'),
          uploadingImage: t('news:uploadingImage'),
          pasteDropSelect: t('news:pasteDropSelect'),
        }}
        paste={{
          saveImage,
        }}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
      />
      <TextField
        label={t('event:link')}
        variant="outlined"
        value={link}
        onChange={(value) => setLink(value.target.value)}
      />
      <Stack direction={large ? 'row' : 'column'} spacing={3}>
        <DateTimePicker
          value={startDateTime}
          onChange={setStartDateTime}
          label={t('booking:startTime')}
          InputProps={{ fullWidth: true }}
        />
        <DateTimePicker
          value={endDateTime}
          onChange={setEndDateTime}
          label={t('booking:endTime')}
          InputProps={{ fullWidth: true }}
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
            if (creatingNew) createEventRequestMutation();
            else updateEventRequestMutation();
          }}
        >
          {creatingNew
            ? t('event:create_new_button')
            : t('event:save_button')}
        </LoadingButton>
        {event && (hasAccess(apiContext, 'event:delete') || authorIsUser(event?.author, user)) && (
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
        )}
      </Box>
    </Stack>
  );
}
