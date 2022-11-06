import { Stack } from '@mui/material';
import { MutableRefObject } from 'react';
import { ArticleQuery } from '~/generated/graphql';
import Comment from './Comment';
import CommentField from './CommentField';

interface CommentsProps {
  id: string,
  comments: ArticleQuery['article']['comments']
  commentInputRef: MutableRefObject<HTMLInputElement>
}

export default function Comments({
  id,
  comments,
  commentInputRef,
}: CommentsProps) {
  return (
    <Stack>
      <Stack marginBottom="1rem" spacing={1}>
        {comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
      </Stack>
      <CommentField id={id} commentInputRef={commentInputRef} />
    </Stack>
  );
}
