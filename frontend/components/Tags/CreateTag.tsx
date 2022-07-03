import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateTagMutation } from '~/generated/graphql';
import Tag from '../Tag';

function CreateTag() {
  const { t } = useTranslation();
  const [createTag] = useCreateTagMutation();
  const router = useRouter();

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
    });
    router.back();
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} alignItems="flex-start">
      <Tag tag={{
        name, nameEn, color, icon,
      }}
      />
      <TextField label={t('news:admin.tags.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label={t('news:admin.tags.nameEn')} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      <TextField label={t('news:admin.tags.color')} value={color} onChange={(e) => setColor(e.target.value)} />
      <TextField label={t('news:admin.tags.icon')} value={icon} onChange={(e) => setIcon(e.target.value)} />
      <Button onClick={onCreate}>{t('create')}</Button>
    </Box>
  );
}

export default CreateTag;
