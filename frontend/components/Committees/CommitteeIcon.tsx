import React, { ComponentProps } from 'react';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import ConstructionIcon from '@mui/icons-material/Construction';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
// import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import StarsIcon from '@mui/icons-material/Stars';
import Diversity1 from '@mui/icons-material/Diversity1';
import SportsBar from '@mui/icons-material/SportsBar';
import TrivselIcon from '../Icons/TrivselIcon';

export default function CommitteeIcon({ name, ...props }: { name: string } &
ComponentProps<typeof StarsIcon>) {
  switch (name) {
    case 'Styrelsen':
      return <StarsIcon {...props} />;
    case 'Cafémästeriet':
      return <LocalCafeIcon {...props} />;
    case 'Näringslivsutskottet':
      return <BusinessIcon {...props} />;
    case 'Källarmästeriet':
      return <ConstructionIcon {...props} />;
    case 'Aktivitetsutskottet':
      return <SportsHockeyIcon {...props} />;
    case 'Informationsutskottet':
      return <NewspaperIcon {...props} />;
    case 'Sexmästeriet':
      return <SportsBar {...props} />;
    case 'Skattmästeriet':
      return <AttachMoneyIcon {...props} />;
    case 'Studierådet':
      return <AutoStoriesIcon {...props} />;
    case 'Trivselrådet':
      return <TrivselIcon {...props} />;
    case 'Framtidsutskottet':
      return <RocketLaunchIcon {...props} />;
    case 'Medaljelelekommittén':
      return <MilitaryTechIcon {...props} />;
    case 'Valberedningen':
      return <HowToVoteIcon {...props} />;
    case 'Nollningsutskottet':
      return <CelebrationIcon {...props} />;
    case 'D-chip':
      return <Diversity1 {...props} />;
    default:
      return <GroupIcon {...props} />;
  }
}
