import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { useRemoveCommentMutation, useRemoveCommentFromEventMutation } from '~/generated/graphql';
import { useDialog } from '~/providers/DialogProvider';

export default function DeleteComment({ commentId, type }: { commentId: string; type: 'article' | 'event' }) {
  const { t, i18n } = useTranslation();
  const { confirm } = useDialog();
  const [removeArticleComment] = useRemoveCommentMutation();
  const [removeEventComment] = useRemoveCommentFromEventMutation();
  const removeComment = type === 'article' ? removeArticleComment : removeEventComment;
  return (
    <IconButton
      sx={{ mt: 2, marginLeft: 'auto' }}
      onClick={() => {
        confirm(selectTranslation(
          i18n,
          `${t('confirmRemoval')} denna kommentar?`,
          `${t('confirmRemoval')} this comment?`,
        ), (value) => {
          if (value) removeComment({ variables: { commentId } });
        });
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}
