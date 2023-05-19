import { styled } from '@mui/system';
import { DESKTOP_MQ } from '~/components/Nolla/constants';

export const DesktopOnly = styled('div')`
width: 100%;
display: none;
${DESKTOP_MQ} {
  display: block;
}
`;

export const MobileOnly = styled('div')`
width: 100%;
display: block;
${DESKTOP_MQ} {
  display: none;
}
`;
