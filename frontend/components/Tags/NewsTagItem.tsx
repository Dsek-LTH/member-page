import * as icons from '@mui/icons-material';
import { TableCell, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import { i18n } from 'next-i18next';
import Link from 'next/link';
import selectTranslation from '~/functions/selectTranslation';
import { Tag } from '~/generated/graphql';

type Props = {
  tag: Tag;
}

function NewsTagItem({ tag }: Props) {
  const {
    name, nameEn, color, icon,
  } = tag;

  const renderTagIcon = () => {
    if (!icon || !icons[icon]) return undefined;
    const Comp = icons[icon];
    return <Comp fontSize="small" style={color ? { color } : undefined} />;
  };

  return (
    <TableRow sx={{
      color,
      // display: 'flex',
      // alignItems: 'center',
      // gap: 2,
      // p: 2,
      // borderBottomWidth: 1,
      // borderColor: 'divider',
    }}
    >
      <TableCell>
        {renderTagIcon()}
      </TableCell>
      <TableCell>
        {name}
      </TableCell>
      <TableCell>
        {nameEn}
      </TableCell>
      <TableCell>
        {color}
      </TableCell>
    </TableRow>
  );
}

export default NewsTagItem;
