import {
  IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

type LikeProps = {
    isLikedByMe: boolean;
    likes: Number;
    tooltip: string;
    toggleLike: () => void;
}

export default function Like({
  isLikedByMe, likes, tooltip, toggleLike,
}: LikeProps) {
  const apiContext = useApiAccess();
  return (
    <Stack direction="row" alignItems="center">
      {hasAccess(apiContext, 'news:article:like') ? (
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
      <Typography variant="h5">{likes}</Typography>
    </Stack>
  );
}
