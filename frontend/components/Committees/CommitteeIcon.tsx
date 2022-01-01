import React from 'react';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import FoundationIcon from '@mui/icons-material/Foundation';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

export default function CommitteeIcon(props: any) {
  const { name } = props;
  switch (name) {
    case 'Cafémästeriet':
      return <LocalCafeIcon {...props} />;
    case 'Näringslivsutskottet':
      return <BusinessIcon {...props} />;
    case 'Källarmästeriet':
      return <FoundationIcon {...props} />;
    case 'Aktivitetsutskottet':
      return <SportsHockeyIcon {...props} />;
    case 'Informationsutskottet':
      return <NewspaperIcon {...props} />;
    case 'Sexmästeriet':
      return <CelebrationIcon {...props} />;
    case 'Skattmästeriet':
      return <AttachMoneyIcon {...props} />;
    case 'Studierådet':
      return <AutoStoriesIcon {...props} />;
    case 'Trivselrådet':
      return <EmojiEmotionsIcon {...props} />;
    case 'Framtidsutskottet':
      return <RocketLaunchIcon {...props} />;
    case 'Medaljelelekommittén':
      return <MilitaryTechIcon {...props} />;
    case 'Valberedningen':
      return <HowToVoteIcon {...props} />;
    /*     case 'Nollningsutskottet':
      return; */
    default:
      return <GroupIcon {...props} />;
  }
}
