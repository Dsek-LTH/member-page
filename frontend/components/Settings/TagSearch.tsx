import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { Tag, useGetTagsQuery } from '~/generated/graphql';

type Props = {
  onSelect: (tagId: Tag) => void
  alreadyChosen?: string[]
};

export default function TagSearch({ onSelect, alreadyChosen }: Props) {
  const { data } = useGetTagsQuery();
  const tags = data?.tags || [];
  const { t, i18n } = useTranslation('news');

  const handleChange = (_, value) => {
    onSelect(value);
  };

  return (
    <Autocomplete
      value={null}
      id="tag-selector"
      options={tags.filter((tag) => !alreadyChosen?.includes(tag.id))}
      getOptionLabel={(tag) => (typeof tag === 'string' ? tag : selectTranslation(i18n, tag.name, tag.nameEn))}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('tags')}
        />
      )}
      clearOnBlur
      blurOnSelect
    />
  );
}
