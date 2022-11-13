import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SocialButton from './SocialButton';

type InterestedProps = {
  iAmInterested: boolean;
  toggleInterested: () => void;
  access: string
};

export default function InterestedIcon({
  iAmInterested, toggleInterested, access,
}: InterestedProps) {
  return (
    <SocialButton
      activeTranslationKey="interested"
      inactiveTranslationKey="interested"
      ActiveIcon={StarIcon}
      InactiveIcon={StarBorderIcon}
      active={iAmInterested}
      toggleAction={toggleInterested}
      tooltip="interestedTooltip"
      access={access}
    />
  );
}
