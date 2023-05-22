import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SocialButton from './SocialButton';

type GoingProps = {
  iAmGoing: boolean;
  toggleGoing: () => void;
  access: string
};

export default function GoingButton({
  iAmGoing, toggleGoing, access,
}: GoingProps) {
  return (
    <SocialButton
      activeTranslationKey="event:going"
      inactiveTranslationKey="event:going"
      ActiveIcon={CheckCircleIcon}
      InactiveIcon={CheckCircleOutlineIcon}
      activeIconColor="#f280a1"
      active={iAmGoing}
      toggleAction={toggleGoing}
      tooltip="goingTooltip"
      access={access}
      variant="outlined"
    />
  );
}
