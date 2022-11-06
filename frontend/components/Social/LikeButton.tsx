import {
  IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useTranslation } from 'react-i18next';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

type LikeProps = {
  isLikedByMe: boolean;
  tooltip: string;
  toggleLike: () => void;
  access: string
};

export default function LikeButton({
  isLikedByMe, tooltip, toggleLike, access,
}: LikeProps) {
  const apiContext = useApiAccess();
  const { t } = useTranslation();
  return (
    <Stack direction="row" alignItems="center">
      {hasAccess(apiContext, access) ? (
        <IconButton onClick={toggleLike}>
          {isLikedByMe ? (
            <ThumbUpIcon />
          ) : (
            <ThumbUpAltOutlinedIcon />
          )}
        </IconButton>
      ) : (
        <Tooltip title={tooltip}>
          <ThumbUpAltOutlinedIcon style={{ marginRight: '0.5rem' }} />
        </Tooltip>
      )}
      <Typography variant="h6">{t('like')}</Typography>
    </Stack>
  );
}
