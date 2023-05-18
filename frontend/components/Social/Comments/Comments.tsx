import { Button, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { MutableRefObject, useState } from 'react';
import { getFullName } from '~/functions/memberFunctions';
import { ArticleQuery } from '~/generated/graphql';
import Comment from './Comment';
import CommentField from './CommentField';

interface CommentsProps {
  id: string,
  type: 'article' | 'event',
  comments: ArticleQuery['article']['comments'],
  commentInputRef?: MutableRefObject<HTMLTextAreaElement>,
  showAll: boolean,
  setShowAll: (showAll: boolean) => void,
}

const MAX_COMMENTS = 4;

export default function Comments({
  id,
  type,
  comments,
  commentInputRef,
  showAll,
  setShowAll,
}: CommentsProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  return (
    <Stack spacing={2} marginTop={comments.length > MAX_COMMENTS ? 0 : 1} id="comments-section">
      {comments.length > MAX_COMMENTS && (
      <Button onClick={() => {
        setShowAll(!showAll);
      }}
      >
        {t(showAll ? 'show_fewer_comments' : 'show_all_comments')}
      </Button>
      )}

      {comments.length > 0 && (
      <Stack marginBottom="1rem" spacing={1}>
        {((showAll || comments.length <= MAX_COMMENTS)
          ? comments
          : comments.slice(comments.length - MAX_COMMENTS, comments.length)
        ).map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            type={type}
            onReply={(member) => {
              setContent((curr) => {
                const start = `@[@${getFullName(member)}](/members/${member.student_id})`;
                if (curr.startsWith(start)) {
                  return curr;
                }
                return `${start} ${curr}`;
              });
              commentInputRef?.current?.focus();
            }}
          />
        ))}
      </Stack>
      )}
      <CommentField
        id={id}
        type={type}
        commentInputRef={commentInputRef}
        content={content}
        setContent={setContent}
      />
    </Stack>
  );
}
