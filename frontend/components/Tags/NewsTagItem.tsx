import * as icons from '@mui/icons-material';
import { TableCell, TableRow } from '@mui/material';
import Link from 'next/link';
import { Tag } from '~/generated/graphql';
import routes from '~/routes';

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
      <TableCell>
        <Link href={routes.editTag(tag.id)}>
          Edit
        </Link>
      </TableCell>
    </TableRow>
  );
}

export default NewsTagItem;
