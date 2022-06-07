import * as icons from '@mui/icons-material';
import { Chip } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import selectTranslation from '~/functions/selectTranslation';
import { GetTagsQuery } from '~/generated/graphql';

type Props = {
  tag: GetTagsQuery['tags'][number]
}

function Tag({ tag }: Props) {
  const { i18n } = useTranslation('common');
  const renderTagIcon = (iconName?: keyof (typeof icons), color?: string) => {
    if (!iconName || !icons[iconName]) return undefined;
    const Comp = icons[iconName];
    return <Comp fontSize="small" style={color ? { color } : undefined} />;
  };

  return (
    <Chip
      key={tag.id}
      icon={renderTagIcon(tag.icon as unknown as (keyof (typeof icons)), tag.color)}
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
