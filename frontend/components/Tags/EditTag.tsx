import { Autocomplete, Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTagQuery, useUpdateTagMutation } from '~/generated/graphql';
import Tag, { tagIcons } from '../Tag';

type Props = {
  id: string
}
function EditTag({ id }: Props) {
  const { t } = useTranslation();
  const { data, loading } = useGetTagQuery({
    variables: {
      id,
    },
  });
  const [updateTag] = useUpdateTagMutation();

  const [name, setName] = useState(data?.tag?.name);
  const [nameEn, setNameEn] = useState(data?.tag?.nameEn);
  const [color, setColor] = useState(data?.tag?.color);
  const [icon, setIcon] = useState(data?.tag?.icon);

  useEffect(() => {
    if (data?.tag) {
      setName(data.tag.name);
      setNameEn(data.tag.nameEn);
      setColor(data.tag.color);
      setIcon(data.tag.icon);
    }
  }, [data?.tag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onSave = () => {
    updateTag({
      variables: {
        id: data.tag.id,
        name,
        nameEn,
        color,
        icon,
      },
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} alignItems="flex-start">
      <Tag tag={data?.tag} />
      <TextField label={t('news:admin.tags.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label={t('news:admin.tags.nameEn')} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      <TextField label={t('news:admin.tags.color')} value={color} onChange={(e) => setColor(e.target.value)} />
      <Autocomplete
        fullWidth
        disablePortal
        options={Object.keys(tagIcons)}
        renderOption={(props, option) => {
          const IconComp = tagIcons[option];
          return (
          <li {...props}>
            <IconComp size="small" sx={{mr: 2}}/> {option}
          </li>
          )
        }}
        renderInput={(params) => <TextField {...params} label={t('news:admin.tags.icon')}/>}
        value={icon !== '' ? icon : null}
        onChange={(_, newValue: string | null) => {
          setIcon(newValue ?? "");
        }}
      />
      <Button onClick={onSave}>{t('update')}</Button>
    </Box>
  );
}

export default EditTag;
