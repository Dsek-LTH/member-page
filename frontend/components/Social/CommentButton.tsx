import {
  Button, Stack, Tooltip, Typography,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useTranslation } from 'next-i18next';
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

  if (hasAccess(access)) {
    return (
      <Button onClick={toggleComment} style={{ color: 'inherit' }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <ChatBubbleOutlineIcon />
          <Typography variant="h6">{t('comment')}</Typography>
        </Stack>
      </Button>
    );
  }

  return (
    <Tooltip title={t('commentTooltip')} style={{ color: 'GrayText' }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ChatBubbleOutlineIcon />
        <Typography variant="h6">{t('comment')}</Typography>
      </Stack>
    </Tooltip>
  );
}
