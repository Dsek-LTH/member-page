import { TableCell, TableRow, Button } from '@mui/material';
import Link from 'next/link';
import { Tag } from '~/generated/graphql';
import routes from '~/routes';

type Props = {
  tag: Tag;
};

function NewsTagItem({ tag }: Props) {
  const {
    name, nameEn, color, isDefault,
  } = tag;
  return (
    <TableRow sx={{
      color,
    }}
    >
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
        {isDefault ? 'Yes' : 'No'}
      </TableCell>
      <TableCell>
        <Link href={routes.editTag(tag.id)} passHref>
          <Button sx={{ p: 0 }} size="small">Edit</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

export default NewsTagItem;
