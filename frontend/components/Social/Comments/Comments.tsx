import { Button, Stack } from '@mui/material';
import { MutableRefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleQuery } from '~/generated/graphql';
import Comment from './Comment';
import CommentField from './CommentField';

interface CommentsProps {
  id: string,
  comments: ArticleQuery['article']['comments'],
  commentInputRef: MutableRefObject<HTMLTextAreaElement>,
}

export default function Comments({
  id,
  comments,
  commentInputRef,
}: CommentsProps) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      {comments.length > 3 && (
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
            .map((comment) => <Comment key={comment.id} comment={comment} />)
          : comments
            .slice(comments.length - 3, comments.length)
            .map((comment) => <Comment key={comment.id} comment={comment} />)}
      </Stack>
      <CommentField id={id} commentInputRef={commentInputRef} />
    </Stack>
  );
}
