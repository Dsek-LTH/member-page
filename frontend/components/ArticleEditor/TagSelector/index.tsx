import {
  Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { useGetTagsQuery } from '~/generated/graphql';
import Tag from '../../Tag';

type Props = {
  currentlySelected: string[],
  onChange: (updated: string[]) => void
};

function TagSelector({ currentlySelected, onChange }: Props) {
  const { data } = useGetTagsQuery();
  const tags = data?.tags || [];
  const theme = useTheme();
  const isPhone = useMediaQuery(`(max-width: ${theme.breakpoints.values.sm}px)`);

  const { t, i18n } = useTranslation('news');

  if (isPhone) {
    return (
      <FormControl fullWidth>
        <InputLabel id="tag-selector-label">{t('tags')}</InputLabel>
        <Select
          id="tag-selector"
          labelId="tag-selector-label"
          label={t('tags')}
          multiple
          value={tags.filter((tag) => currentlySelected.includes(tag.id)).map((tag) => tag.id)}
          onChange={(event) => {
            const { value } = event.target;
            onChange(typeof value === 'string' ? value.split(',') : value);
          }}
          renderValue={(values) => {
            const TagComponents = values.map((value) => {
              const tagValue = tags.find((tag) => tag.id === value);
              if (!tagValue) return value;
              return <Tag key={value} tag={tagValue} />;
            });
            return TagComponents;
          }}
          MenuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          {tags.map((tag) => (
            <MenuItem value={tag.id} key={tag.id}>
              {selectTranslation(i18n, tag.name, tag.nameEn)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    );
  }

  return (
    <Autocomplete
      multiple
      value={tags.filter((tag) => currentlySelected.includes(tag.id))}
      id="tag-selector"
      options={tags}
      getOptionLabel={(tag) => (typeof tag === 'string' ? tag : selectTranslation(i18n, tag.name, tag.nameEn))}
      onChange={(_, value: any) => {
        onChange(value.map((tag) => tag.id));
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Tag key={option.id} tag={option} {...getTagProps({ index })} />
        ))}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('tags')}
        />
      )}
    />
  );
}

export default TagSelector;
