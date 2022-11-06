import {
  IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useTranslation } from 'react-i18next';
import { useApiAccess } from '~/providers/ApiAccessProvider';

type CommentProps = {
  toggleComment: () => void
  access: string
};

export default function CommentButton({
  toggleComment,
  access,
}: CommentProps) {
  const { hasAccess } = useApiAccess();
  const { t } = useTranslation();
  return (
    <Stack direction="row" alignItems="center">
      {hasAccess(access) ? (
        <IconButton onClick={toggleComment}>
          <ChatBubbleOutlineIcon />
        </IconButton>
      ) : (
        <Tooltip title={t('commentTooltip')}>
          <ChatBubbleOutlineIcon style={{ marginRight: '0.5rem' }} />
        </Tooltip>
      )}
      <Typography variant="h6">{t('comment')}</Typography>
    </Stack>
  );
}
