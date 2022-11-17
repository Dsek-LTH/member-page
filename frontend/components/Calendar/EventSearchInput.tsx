import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'next-i18next';
import { Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import routes from '~/routes';
import { EventHit } from '~/types/EventHit';
import BigCalendarDay from './BigCalendarDay';
import selectTranslation from '~/functions/selectTranslation';

function borderColor(theme): string {
  return theme.palette.mode === 'light'
    ? `1px solid ${theme.palette.common.black}`
    : '';
}

const Search = styled('div')(({ theme }) => ({
  border: borderColor(theme),
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '24ch',
    },
  },
}));

export default function SearchInput({ onSelect } :
{ onSelect: (slug: string, id: string) => void }) {
  const { t, i18n } = useTranslation('common');
  const [options, setOptions] = useState<readonly EventHit[]>([]);
  const [event, setEvent] = useState<EventHit>(null);
  const searchUrl = typeof window !== 'undefined' ? `${routes.eventsSearchApi}` : '';

  async function onSearch(query: string) {
    if (query.length > 0) {
      const res = await fetch(`${searchUrl}?q=${query}`);
      const data = await res.json();
      setOptions(data.hits);
    } else {
      setOptions([]);
    }
  }

  return (
    <Autocomplete
      id="user-search"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option: EventHit) =>
        (typeof option === 'object'
          ? option?.title
          : option)}
      renderOption={(props, option) => {
        const startDate = DateTime.fromISO(option.start_datetime).setLocale(
          i18n.language,
        );
        return (
          <li
            {...props}
            style={{
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
            }}
            key={option.id}
          >
            <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
              <Stack>
                <Typography fontWeight="700">
                  {`${selectTranslation(i18n, option.title, option.title_en)} - ${startDate.toLocaleString()}`}
                </Typography>
                <Typography>
                  {selectTranslation(i18n, option.short_description, option.short_description_en)}
                </Typography>
              </Stack>
              <BigCalendarDay small day={startDate.day} />
            </Stack>
          </li>
        );
      }}
      options={options}
      value={event}
      filterOptions={(x) => x}
      freeSolo
      autoHighlight
      includeInputInList
      noOptionsText={t('no_results')}
      onChange={(_event: any, eventHit: EventHit | null, reason) => {
        if (eventHit) {
          if (reason === 'selectOption') {
            onSelect(eventHit.slug, eventHit.id);
          }
          setOptions(eventHit ? [eventHit, ...options] : options);
          setEvent(eventHit);
        }
      }}
      onInputChange={(_event, newInputValue) => {
        setEvent(null);
        onSearch(newInputValue);
      }}
      renderInput={(params) => (
        <Search ref={params.InputProps.ref}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            inputProps={params.inputProps}
            placeholder={t('event:search_for_events')}
          />
        </Search>
      )}
      renderGroup={(params) => params}
    />
  );
}
