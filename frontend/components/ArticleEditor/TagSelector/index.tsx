import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { GetTagsQuery } from '~/generated/graphql';
import Tag from '../../Tag';

type TagType = GetTagsQuery['tags'][number];
type Props = {
  tags: TagType[]
  currentlySelected: string[],
  onChange: (updated: string[]) => void
};

function TagSelector({ tags, currentlySelected, onChange }: Props) {
  const handleChange = (_, value) => {
    onChange(value.map((tag) => tag.id));
  };
  const { t, i18n } = useTranslation('news');

  return (
    <Autocomplete
      multiple
      value={tags.filter((tag) => currentlySelected.includes(tag.id))}
      id="tag-selector"
      options={tags}
      getOptionLabel={(tag) => (typeof tag === 'string' ? tag : selectTranslation(i18n, tag.name, tag.nameEn))}
      onChange={handleChange}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Tag key={option.id} tag={option} {...getTagProps({ index })} />
        ))}
      renderInput={(params) => (
        <TextField {...params} label={t('tags')} />
      )}
    />
  );
}

export default TagSelector;
