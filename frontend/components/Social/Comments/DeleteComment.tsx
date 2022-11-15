import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import YesNoDialog from '~/components/YesNoDialog';
import selectTranslation from '~/functions/selectTranslation';
import { useRemoveCommentMutation, useRemoveCommentFromEventMutation } from '~/generated/graphql';

export default function DeleteComment({ commentId, type }: { commentId: string; type: 'article' | 'event' }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [removeArticleComment] = useRemoveCommentMutation();
  const [removeEventComment] = useRemoveCommentFromEventMutation();
  const removeComment = type === 'article' ? removeArticleComment : removeEventComment;
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
