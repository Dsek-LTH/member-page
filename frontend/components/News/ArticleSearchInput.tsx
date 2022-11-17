import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'next-i18next';
import { Typography } from '@mui/material';
import { DateTime } from 'luxon';
import routes from '~/routes';
import selectTranslation from '~/functions/selectTranslation';
import { ArticleHit } from '~/types/ArticleHit';

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
  const [options, setOptions] = useState<readonly ArticleHit[]>([]);
  const [article, setArticle] = useState<ArticleHit>(null);
  const searchUrl = typeof window !== 'undefined' ? `${routes.articlesSearchApi}` : '';

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
      getOptionLabel={(option: ArticleHit) =>
        (typeof option === 'object'
          ? option?.header
          : option)}
      renderOption={(props, option) => {
        const date = DateTime.fromISO(option.published_datetime);
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
            <Typography>
              {selectTranslation(i18n, option.header, option.header)}
              {' '}
              -
              {' '}
              {date.toLocaleString()}
            </Typography>
          </li>
        );
      }}
      options={options}
      value={article}
      filterOptions={(x) => x}
      freeSolo
      autoHighlight
      includeInputInList
      noOptionsText={t('no_results')}
      onChange={(_event: any, articleHit: ArticleHit | null, reason) => {
        if (articleHit) {
          if (reason === 'selectOption') {
            onSelect(articleHit.slug, articleHit.id);
          }
          setOptions(articleHit ? [articleHit, ...options] : options);
          setArticle(articleHit);
        }
      }}
      onInputChange={(_event, newInputValue) => {
        setArticle(null);
        onSearch(newInputValue);
      }}
      renderInput={(params) => (
        <Search ref={params.InputProps.ref}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            inputProps={params.inputProps}
            placeholder={t('news:search_for_articles')}
          />
        </Search>
      )}
      renderGroup={(params) => params}
    />
  );
}
