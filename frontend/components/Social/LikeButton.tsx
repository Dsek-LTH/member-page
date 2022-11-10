import {
  Button, Stack, Tooltip, Typography,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useTranslation } from 'next-i18next';
import { useApiAccess } from '~/providers/ApiAccessProvider';

type LikeProps = {
  isLikedByMe: boolean;
  tooltip: string;
  toggleLike: () => void;
  access: string
};

export default function LikeButton({
  isLikedByMe, tooltip, toggleLike, access,
}: LikeProps) {
  const { hasAccess } = useApiAccess();
  const { t } = useTranslation();

  if (hasAccess(access)) {
    return (
      <Button onClick={toggleLike} style={{ color: 'inherit' }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {isLikedByMe ? (
            <ThumbUpIcon />
          ) : (
            <ThumbUpAltOutlinedIcon />
          )}
          <Typography variant="h6">{t('like')}</Typography>
        </Stack>

      </Button>
    );
  }
  return (
    <Tooltip title={tooltip} style={{ color: 'GrayText' }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ThumbUpAltOutlinedIcon />
        <Typography variant="h6">{t('like')}</Typography>
      </Stack>
    </Tooltip>
  );
}
