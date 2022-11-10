import { Autocomplete, Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCreateTagMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import routes from '~/routes';
import Tag, { tagIcons } from '../Tag';

function CreateTag() {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const [createTag] = useCreateTagMutation();

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');

  const onCreate = async () => {
    await createTag({
      variables: {
        name,
        nameEn,
        color,
        icon,
      },
    }).then(() => {
      showMessage('Successfully updated tag', 'success');
      router.push(routes.tags);
    })
      .catch((err) => {
        showMessage(err, 'error');
      });
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} alignItems="flex-start">
      <Tag tag={{
        name, nameEn, color, icon,
      }}
      />
      <TextField fullWidth label={t('news:admin.tags.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField fullWidth label={t('news:admin.tags.nameEn')} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      <TextField fullWidth label={t('news:admin.tags.color')} value={color} onChange={(e) => setColor(e.target.value)} />
      <Autocomplete
        fullWidth
        disablePortal
        options={Object.keys(tagIcons)}
        renderOption={(props, option) => {
          const IconComp = tagIcons[option];
          return (
            <li {...props}>
              <IconComp size="small" sx={{ mr: 2 }} />
              {' '}
              {option}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={t('news:admin.tags.icon')} />}
        value={icon !== '' ? icon : null}
        onChange={(_, newValue: string | null) => {
          setIcon(newValue ?? '');
        }}
      />
      <Button onClick={onCreate}>{t('create')}</Button>
    </Box>
  );
}

export default CreateTag;
