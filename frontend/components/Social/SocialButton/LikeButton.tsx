import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import SocialButton from './SocialButton';

type LikeProps = {
  isLikedByMe: boolean;
  toggleLike: () => void;
  access: string
};

export default function LikeButton({
  isLikedByMe, toggleLike, access,
}: LikeProps) {
  return (
    <SocialButton
      activeTranslationKey="unlike"
      inactiveTranslationKey="like"
      ActiveIcon={ThumbUpIcon}
      InactiveIcon={ThumbUpAltOutlinedIcon}
      active={isLikedByMe}
      toggleAction={toggleLike}
      tooltip="likeTooltip"
      access={access}
    />
  );
}
