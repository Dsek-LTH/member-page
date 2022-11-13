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
      activeTranslationKey="going"
      inactiveTranslationKey="going"
      ActiveIcon={CheckCircleIcon}
      InactiveIcon={CheckCircleOutlineIcon}
      active={iAmGoing}
      toggleAction={toggleGoing}
      tooltip="goingTooltip"
      access={access}
    />
  );
}
