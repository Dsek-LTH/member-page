import {
  Table, TableCell, TableHead, TableRow,
} from '@mui/material';
import React from 'react';
import { useGetTagsQuery } from '~/generated/graphql';
import NewsTagItem from './NewsTagItem';

function NewsTagList() {
  const { data, loading } = useGetTagsQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Icon</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Name (En)</TableCell>
          <TableCell>Color</TableCell>
          <TableCell>Edit</TableCell>
        </TableRow>
      </TableHead>
      {data.tags.map((tag) => (
        <NewsTagItem key={tag.id} tag={tag} />
      ))}
    </Table>
  );
}

export default NewsTagList;
