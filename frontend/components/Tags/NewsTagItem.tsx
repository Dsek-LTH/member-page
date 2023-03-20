import Restaurant from '@mui/icons-material/Restaurant';
import Business from '@mui/icons-material/Business';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Groups from '@mui/icons-material/Groups'; import { Button, TableCell, TableRow } from '@mui/material';
import Link from 'next/link';
import { Tag } from '~/generated/graphql';
import routes from '~/routes';

export const icons = {
  Restaurant,
  Business,
  PriorityHigh,
  Groups,
};

type Props = {
  tag: Tag;
};

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
          <Button sx={{ p: 0 }} size="small">Edit</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

export default NewsTagItem;
