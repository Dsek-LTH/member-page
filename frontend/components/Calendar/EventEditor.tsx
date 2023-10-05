/* eslint-disable @typescript-eslint/no-use-before-define */
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import
{
  Box,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  useMediaQuery,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import React, { useContext, useState } from 'react';
import TagSelector from '~/components/ArticleEditor/TagSelector';
import handleApolloError from '~/functions/handleApolloError';
import
{
  EventQuery,
  useCreateEventMutation,
  useRemoveEventMutation,
  useUpdateEventMutation,
} from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useDialog } from '~/providers/DialogProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import UserContext, { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import DateTimePicker from '../DateTimePicker';
import Link from '../Link';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import MarkdownEditor from '../MarkdownEditor';

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
  }
  if (removeCalled) {
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
  const [tagIds, setTagIds] = useState<string[]>(
    event?.tags ? event.tags.map((tag) => tag.id) : [],
  );
  const [alarmActive, setAlarmActive] = useState(event?.alarm_active || false);
  const [startDateTime, setStartDateTime] = useState(
    event?.start_datetime
      ? DateTime.fromISO(event.start_datetime)
      : DateTime.now(),
  );
  const [endDateTime, setEndDateTime] = useState(
    event?.end_datetime ? DateTime.fromISO(event.end_datetime) : DateTime.now(),
  );
  const [selectedLanguage, setSelectedLanguage] = useState<SelectedLanguage>('sv');
  const english = selectedLanguage === 'en';
  const { loading: userLoading } = useContext(UserContext);
  const apiContext = useApiAccess();
  const { showMessage } = useSnackbar();
  const { confirm } = useDialog();
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

  const onBodyChange = (value: string) => {
    if (english) setDescriptionEn(value);
    else setDescription(value);
  };

  const [
    createEventRequestMutation,
    { loading: createLoading, called: createCalled },
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
      alarm_active: alarmActive,
      tagIds,
    },
    onCompleted: () => onComplete(),
    onError: (error) =>
      handleApolloError(
        error,
        showMessage,
        t,
        `event:${snackbarMessageVariation(creatingNew, removeCalled)}_error`,
      ),
  });

  const [updateEventRequestMutation, { loading: updateLoading }] = useUpdateEventMutation({
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
      alarm_active: alarmActive,
      tagIds,
    },
    onCompleted: () => onComplete(),
    onError: (error) =>
      handleApolloError(
        error,
        showMessage,
        t,
        `event:${snackbarMessageVariation(creatingNew, removeCalled)}_error`,
      ),
  });

  const [
    removeEventRequestMutation,
    { loading: removeLoading, called: removeCalled },
  ] = useRemoveEventMutation({
    variables: {
      id: event?.id,
    },
    onCompleted: () => onComplete(),
    onError: (error) =>
      handleApolloError(
        error,
        showMessage,
        t,
        `event:${snackbarMessageVariation(creatingNew, removeCalled)}_error`,
      ),
  });

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
      <Link newTab href="https://www.markdownguide.org/cheat-sheet/">
        {t('news:markdown_guide')}
      </Link>
      <MarkdownEditor
        body={english ? descriptionEn : description}
        onBodyChange={onBodyChange}
        header={title}
      />
      <TextField
        label={t('event:link')}
        variant="outlined"
        value={link}
        onChange={(value) => setLink(value.target.value)}
      />
      <TagSelector currentlySelected={tagIds} onChange={setTagIds} />
      <FormControlLabel
        control={(
          <Checkbox
            checked={alarmActive}
            onChange={(e) => setAlarmActive(e.target.checked)}
          />
        )}
        label={t('event:alarm_door')}
      />
      <Stack direction={large ? 'row' : 'column'} spacing={3}>
        <DateTimePicker
          value={startDateTime}
          onChange={setStartDateTime}
          label={t('booking:startTime')}
        />
        <DateTimePicker
          value={endDateTime}
          onChange={setEndDateTime}
          label={t('booking:endTime')}
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
          {creatingNew ? t('event:create_new_button') : t('event:save_button')}
        </LoadingButton>
        {event
          && (hasAccess(apiContext, 'event:delete')
            || event.author?.id === user.id) && (
            <LoadingButton
              color="error"
              loading={removeLoading}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              variant="outlined"
              onClick={() => {
                confirm(t('event:remove_confirm'), (confirmed) => {
                  if (confirmed) removeEventRequestMutation();
                });
              }}
            >
              {t('event:remove_button')}
            </LoadingButton>
        )}
      </Box>
    </Stack>
  );
}
