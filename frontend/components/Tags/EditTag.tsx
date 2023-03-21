import {
  Button, Checkbox, FormControlLabel, TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGetTagQuery, useUpdateTagMutation } from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import routes from '~/routes';
import Tag from '../Tag';

type Props = {
  id: string
};
function EditTag({ id }: Props) {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const { data, loading } = useGetTagQuery({
    variables: {
      id,
    },
  });
  const [updateTag] = useUpdateTagMutation();

  const [name, setName] = useState(data?.tag?.name);
  const [nameEn, setNameEn] = useState(data?.tag?.nameEn);
  const [color, setColor] = useState(data?.tag?.color);
  const [isDefault, setIsDefault] = useState<boolean>(data?.tag?.isDefault ?? false);

  useEffect(() => {
    if (data?.tag) {
      setName(data.tag.name);
      setNameEn(data.tag.nameEn);
      setColor(data.tag.color);
      setIsDefault(data.tag.isDefault);
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
        id: data.tag.id,
        name,
        nameEn,
        color,
        isDefault,
      }}
      />
      <TextField label={t('news:admin.tags.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label={t('news:admin.tags.nameEn')} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      <TextField
        label={t('news:admin.tags.color')}
        value={color}
        onChange={(e) => setColor(e.target.value)}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <FormControlLabel
        control={(
          <Checkbox
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
    )}
        label="Is default"
      />
      <Button onClick={onSave}>{t('update')}</Button>
    </Box>
  );
}

export default EditTag;
