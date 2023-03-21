import {
  Button, Checkbox, FormControlLabel, TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCreateTagMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import routes from '~/routes';
import Tag from '../Tag';

function CreateTag() {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const [createTag] = useCreateTagMutation();

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [color, setColor] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const onCreate = async () => {
    await createTag({
      variables: {
        name,
        nameEn,
        color,
        isDefault,
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
        id: '0',
        name,
        nameEn,
        color,
        isDefault,
      }}
      />
      <TextField fullWidth label={t('news:admin.tags.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField fullWidth label={t('news:admin.tags.nameEn')} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      <TextField fullWidth label={t('news:admin.tags.color')} value={color} onChange={(e) => setColor(e.target.value)} />
      <FormControlLabel
        control={(
          <Checkbox
            checked={isDefault ?? false}
            onChange={(e) => setIsDefault(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
    )}
        label="Is default"
      />
      <Button onClick={onCreate}>{t('create')}</Button>
    </Box>
  );
}

export default CreateTag;
