import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SocialButton from './SocialButton';

type InterestedProps = {
  iAmInterested: boolean;
  toggleInterested: () => void;
  access: string
};

export default function InterestedButton({
  iAmInterested, toggleInterested, access,
}: InterestedProps) {
  return (
    <SocialButton
      activeTranslationKey="event:interested"
      inactiveTranslationKey="event:interested"
      ActiveIcon={StarIcon}
      activeIconColor="gold"
      InactiveIcon={StarBorderIcon}
      active={iAmInterested}
      toggleAction={toggleInterested}
      tooltip="interestedTooltip"
      access={access}
    />
  );
}
