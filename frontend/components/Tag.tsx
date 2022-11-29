import Restaurant from '@mui/icons-material/Restaurant';
import Business from '@mui/icons-material/Business';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Groups from '@mui/icons-material/Groups';
import { Chip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Link from '~/components/Link';
import selectTranslation from '~/functions/selectTranslation';
import { Tag as TagType } from '~/generated/graphql';

export const tagIcons = {
  Restaurant,
  Business,
  PriorityHigh,
  Groups,
};

type Props = {
  tag: TagType;
} & React.ComponentProps<typeof Chip>;

function TagComponent({ tag, ...chipProps }: Props) {
  const { i18n } = useTranslation('common');
  const renderTagIcon = (iconName?: string, color?: string) => {
    if (!iconName || !tagIcons[iconName]) return undefined;
    const Comp = tagIcons[iconName];
    return <Comp fontSize="small" style={color ? { color } : undefined} />;
  };
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
        cursor: 'pointer',
      }}
      {...chipProps}
    />
  );
}

function Tag({ tag, ...chipProps }: Props) {
  const [url, setURL] = useState('');
  useEffect(() => {
    const newUrl = new URL(`${global?.location?.origin}/news`);
    newUrl.searchParams.set('tags', JSON.stringify([tag.id]));
    setURL(newUrl.href);
  }, []);
  if (!tag) {
    return null;
  }
  const shouldLink = !chipProps.onDelete;
  if (shouldLink) {
    return (
      <Link href={url}>
        <TagComponent tag={tag} {...chipProps} />
      </Link>
    );
  }
  return (
    <TagComponent tag={tag} {...chipProps} />
  );
}

export default Tag;
