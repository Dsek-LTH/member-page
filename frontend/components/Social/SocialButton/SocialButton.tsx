import {
  Button, Stack, SvgIconTypeMap, Tooltip, Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useTranslation } from 'next-i18next';
import { useApiAccess } from '~/providers/ApiAccessProvider';

type MuiIcon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
  muiName: string;
};

type Props = {
  active: boolean;
  tooltip: string;
  toggleAction: () => void;
  access: string;
  ActiveIcon?: MuiIcon;
  InactiveIcon: MuiIcon;
  activeTranslationKey?: string;
  inactiveTranslationKey: string;
};

export default function SocialButton({
  active,
  tooltip,
  toggleAction,
  access,
  ActiveIcon,
  InactiveIcon,
  activeTranslationKey,
  inactiveTranslationKey,
}: Props) {
  const { hasAccess } = useApiAccess();
  const { t } = useTranslation();

  if (hasAccess(access)) {
    return (
      <Button onClick={toggleAction} style={{ color: 'inherit' }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {active ? (
            <ActiveIcon />
          ) : (
            <InactiveIcon />
          )}
          <Typography variant="h6">{t(active ? activeTranslationKey : inactiveTranslationKey)}</Typography>
        </Stack>

      </Button>
    );
  }
  return (
    <Tooltip title={tooltip} style={{ color: 'GrayText' }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <InactiveIcon />
        <Typography variant="h6">{t(inactiveTranslationKey).toUpperCase()}</Typography>
      </Stack>
    </Tooltip>
  );
}
