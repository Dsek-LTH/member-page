import {
  Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { GetTagsQuery } from '~/generated/graphql';
import Tag from '../../Tag';
import selectTranslation from '~/functions/selectTranslation';

type TagType = GetTagsQuery['tags'][number];
type Props = {
  tags: TagType[]
  currentlySelected: string[],
  onChange: (updated: string[]) => void
};

function TagSelector({ tags, currentlySelected, onChange }: Props) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(value);
  };
  const { t, i18n } = useTranslation('news');

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id="tag-selector-label">{t('tags')}</InputLabel>
      <Select<string[]>
        labelId="tag-selector-label"
        id="tag-selector"
        multiple
        value={currentlySelected}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={t('tags')} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Tag key={value} tag={tags.find((tag) => tag.id === value)} />
            ))}
          </Box>
        )}
      >
        {tags.map((tag) => (
          <MenuItem
            key={tag.id}
            value={tag.id}
          >
            {selectTranslation(i18n, tag.name, tag.nameEn)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TagSelector;
