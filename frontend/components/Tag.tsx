import Restaurant from '@mui/icons-material/Restaurant';
import Business from '@mui/icons-material/Business';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Groups from '@mui/icons-material/Groups';
import { Chip } from '@mui/material';
import React from 'react';
import { useTranslation } from 'next-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { Tag as TagType } from '~/generated/graphql';

export const tagIcons = {
  Restaurant,
  Business,
  PriorityHigh,
  Groups,
};

type Props = {
  tag: Omit<TagType, 'id'> | undefined;
};

function Tag({ tag }: Props) {
  const { i18n } = useTranslation('common');
  const renderTagIcon = (iconName?: string, color?: string) => {
    if (!iconName || !tagIcons[iconName]) return undefined;
    const Comp = tagIcons[iconName];
    return <Comp fontSize="small" style={color ? { color } : undefined} />;
  };

  if (!tag) {
    return null;
  }

  return (
    <Chip
      icon={renderTagIcon(tag.icon, tag.color)}
      label={selectTranslation(i18n, tag.name, tag.nameEn)}
      size="small"
      variant="outlined"
      style={{
        color: tag.color,
        borderColor: tag.color,
        padding: 8,
        margin: 4,
      }}
    />
  );
}

export default Tag;
