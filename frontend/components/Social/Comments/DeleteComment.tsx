import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import YesNoDialog from '~/components/YesNoDialog';
import selectTranslation from '~/functions/selectTranslation';
import { useRemoveCommentMutation } from '~/generated/graphql';

export default function DeleteComment({ commentId }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [removeComment] = useRemoveCommentMutation();
  return (
    <>
      <IconButton
        style={{ marginLeft: 'auto' }}
        onClick={() => setDeleteDialogOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <YesNoDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleYes={() => {
          removeComment({ variables: { commentId } });
        }}
      >
        {selectTranslation(
          i18n,
          `${t('confirmRemoval')} denna kommentar?`,
          `${t('confirmRemoval')} this comment?`,
        )}
      </YesNoDialog>
    </>
  );
}
