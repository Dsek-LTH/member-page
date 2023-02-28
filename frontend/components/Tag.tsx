import Restaurant from '@mui/icons-material/Restaurant';
import Business from '@mui/icons-material/Business';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Groups from '@mui/icons-material/Groups';
import { Chip, hslToRgb } from '@mui/material';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from '~/components/Link';
import selectTranslation from '~/functions/selectTranslation';
import { Tag as TagType } from '~/generated/graphql';

type Props = {
  tag: TagType;
} & React.ComponentProps<typeof Chip>;

function TagComponent({ tag, ...chipProps }: Props) {
  const { i18n } = useTranslation('common');
  const theme = useTheme();
  const darkColor = colorAppropiator('rgb(255,255,0)', 'black');
  const lightColor = colorAppropiator('rgb(255,255,0)', 'white');
  const renderTagIcon = (iconName?: string, color?: string) => {
    if (!iconName || !tagIcons[iconName]) return undefined;
    const Comp = tagIcons[iconName];
    return <Comp fontSize="small" style={color ? { color } : undefined} />;
  };
  return (
    <Chip
      icon={theme.palette.mode === 'dark' ? renderTagIcon(tag.icon, darkColor) : renderTagIcon(tag.icon, lightColor)}
      label={selectTranslation(i18n, tag.name, tag.nameEn)}
      size="small"
      variant="outlined"
      style={theme.palette.mode === 'dark' ? {
        color: darkColor,
        borderColor: darkColor,
        padding: 8,
        margin: 4,
        cursor: 'pointer',
      } : {
        color: lightColor,
        borderColor: lightColor,
        padding: 8,
        margin: 4,
        cursor: 'pointer',
      }}
      {...chipProps}
    />
  );
}

function Tag({ tag, ...chipProps }: Props) {
  if (!tag) {
    return null;
  }
  const shouldLink = !chipProps.onDelete;
  if (shouldLink) {
    return (
      <Link href={`/news?tags=${tag.id}`}>
        <TagComponent tag={tag} {...chipProps} />
      </Link>
    );
  }
  return (
    <TagComponent tag={tag} {...chipProps} />
  );
}

export default Tag;
