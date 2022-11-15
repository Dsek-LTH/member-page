import { Button, Stack } from '@mui/material';
import { MutableRefObject, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ArticleQuery } from '~/generated/graphql';
import Comment from './Comment';
import CommentField from './CommentField';

interface CommentsProps {
  id: string,
  type: 'article' | 'event',
  comments: ArticleQuery['article']['comments'],
  commentInputRef?: MutableRefObject<HTMLTextAreaElement>,
}

export default function Comments({
  id,
  type,
  comments,
  commentInputRef,
}: CommentsProps) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      {comments.length > 2 && (
      <Button onClick={() => {
        setShowAll(!showAll);
      }}
      >
        {t(showAll ? 'show_fewer_comments' : 'show_all_comments')}
      </Button>
      )}

      <Stack marginBottom="1rem" spacing={1}>
        {showAll
          ? comments
            .map((comment) => <Comment key={comment.id} comment={comment} type={type} />)
          : comments
            .slice(comments.length - 2, comments.length)
            .map((comment) => <Comment key={comment.id} comment={comment} type={type} />)}
      </Stack>
      <CommentField id={id} type={type} commentInputRef={commentInputRef} />
    </Stack>
  );
}
