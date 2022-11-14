import { Button, Stack } from '@mui/material';
import { MutableRefObject, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ArticleQuery } from '~/generated/graphql';
import Comment from './Comment';
import CommentField from './CommentField';

interface CommentsProps {
  id: string,
  comments: ArticleQuery['article']['comments'],
  commentInputRef: MutableRefObject<HTMLTextAreaElement>,
  showAll?: boolean, // If true, will remove ability to "hide comments" and only show all
}

const MAX_COMMENTS = 2;

export default function Comments({
  id,
  comments,
  commentInputRef,
  showAll: showAllProp,
}: CommentsProps) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  return (
    <Stack spacing={2} marginTop={comments.length > MAX_COMMENTS && !showAllProp ? 0 : 1}>
      {comments.length > MAX_COMMENTS && !showAllProp && (
      <Button onClick={() => {
        setShowAll(!showAll);
      }}
      >
        {t(showAll ? 'show_fewer_comments' : 'show_all_comments')}
      </Button>
      )}

      <Stack marginBottom="1rem" spacing={1}>
        {showAll || showAllProp
          ? comments
            .map((comment) => <Comment key={comment.id} comment={comment} />)
          : comments
            .slice(comments.length - MAX_COMMENTS, comments.length)
            .map((comment) => <Comment key={comment.id} comment={comment} />)}
      </Stack>
      <CommentField id={id} commentInputRef={commentInputRef} />
    </Stack>
  );
}
