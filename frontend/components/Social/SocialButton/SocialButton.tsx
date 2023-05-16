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
  activeIconColor?: string;
  variant?: 'text' | 'outlined' | 'contained';
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
  activeIconColor,
  variant,
}: Props) {
  const { hasAccess } = useApiAccess();
  const { t } = useTranslation();

  if (hasAccess(access)) {
    return (
      <Button
        onClick={toggleAction}
        style={{
          color: 'inherit',
          textTransform: 'none',
          width: 'fit-content',
          fontSize: '1rem',
        }}
        variant={variant}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {active ? (
            <ActiveIcon htmlColor={activeIconColor} fontSize="inherit" />
          ) : (
            <InactiveIcon fontSize="inherit" />
          )}
          <Typography variant="h6" fontSize="1rem">{t(active ? activeTranslationKey : inactiveTranslationKey)}</Typography>
        </Stack>

      </Button>
    );
  }
  return (
    <Tooltip title={t(tooltip)} style={{ color: 'rgb(128, 128, 128)' }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <InactiveIcon fontSize="inherit" />
        <Typography variant="h6">{t(inactiveTranslationKey)}</Typography>
      </Stack>
    </Tooltip>
  );
}
