import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, DialogContentText,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useUpdateFoodPreferenceMutation } from '~/generated/graphql';

export default function AddFoodPreferencePopup({ open, id, refetchUser }: { open: boolean,
  id: string, refetchUser: () => void }) {
  const [foodPreference, setFoodPreference] = useState('');
  const [updateFoodPreferenceMutation] = useUpdateFoodPreferenceMutation();
  const { t } = useTranslation(['common']);
  return (
    <Dialog open={open}>
      <DialogTitle>{t('add_food_preference')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('food_preference_examples')}</DialogContentText>
        <TextField
          value={foodPreference}
          onChange={(e) => setFoodPreference(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              updateFoodPreferenceMutation({
                variables: {
                  id,
                  foodPreference,
                },
              }).then(() => refetchUser());
            }
          }}
          autoFocus
          multiline
          margin="dense"
          id="name"
          fullWidth
          variant="standard"
          sx={{ width: 400, maxWidth: '100%' }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => updateFoodPreferenceMutation({
            variables: {
              id,
              foodPreference: '',
            },
          }).then(() => refetchUser())}
        >
          {t('no_food_preference')}
        </Button>
        <Button
          color="primary"
          onClick={() => updateFoodPreferenceMutation({
            variables: {
              id,
              foodPreference,
            },
          }).then(() => refetchUser())}
          disabled={!foodPreference}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
