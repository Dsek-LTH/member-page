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
    access: string
}

export default function Like({
  isLikedByMe, likes, tooltip, toggleLike, access,
}: LikeProps) {
  const apiContext = useApiAccess();
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
      <Typography variant="h5">{likes}</Typography>
    </Stack>
  );
}
