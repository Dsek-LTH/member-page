import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SocialButton from './SocialButton';

type CommentProps = {
  toggleComment: () => void
  access: string
};

export default function CommentButton({
  toggleComment,
  access,
}: CommentProps) {
  return (
    <SocialButton
      toggleAction={toggleComment}
      access={access}
      tooltip="commentTooltip"
      InactiveIcon={ChatBubbleOutlineIcon}
      inactiveTranslationKey="comment"
      active={false}
    />
  );
}
