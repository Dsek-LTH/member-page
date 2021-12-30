import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import routes from '~/routes';
import { MemberHit } from '~/types/MemberHit';

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
    marginLeft: theme.spacing(1),
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
      width: '26ch',
    },
  },
}));

export default function SearchInput() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [options, setOptions] = useState<readonly MemberHit[]>([]);
  const [member, setMember] = useState<MemberHit>(null);
  const searchUrl = typeof window !== 'undefined' ? `${window.location.origin}${routes.searchApi}` : '';

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
      getOptionLabel={(option) =>
        (option
          ? `${option.first_name} ${option.last_name} (${option.student_id})`
          : '')}
      options={options}
      value={member}
      filterOptions={(x) => x}
      freeSolo
      autoHighlight
      includeInputInList
      noOptionsText={t('no_results')}
      onChange={(event: any, newValue: MemberHit | null, reason) => {
        if (reason === 'selectOption') router.push(routes.member(newValue.id));
        setOptions(newValue ? [newValue, ...options] : options);
        setMember(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        onSearch(newInputValue);
      }}
      renderInput={(params) => (
        <Search ref={params.InputProps.ref}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            inputProps={params.inputProps}
            placeholder={t('search_for_members')}
          />
        </Search>
      )}
    />
  );
}
