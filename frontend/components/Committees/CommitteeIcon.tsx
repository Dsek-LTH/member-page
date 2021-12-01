import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import FoundationIcon from '@mui/icons-material/Foundation';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

export const CommitteeIcon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> = (
  props
) => {
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
    /*     case 'Nollningsutskottet':
      return; */
    default:
      return <GroupIcon {...props} />;
  }
};
