import { Chip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import Link from '~/components/Link';
import selectTranslation from '~/functions/selectTranslation';
import { Tag as TagType } from '~/generated/graphql';

type Props = {
  tag: TagType;
} & React.ComponentProps<typeof Chip>;

function TagComponent({ tag, ...chipProps }: Props) {
  const { i18n } = useTranslation('common');
  return (
    <Chip
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
