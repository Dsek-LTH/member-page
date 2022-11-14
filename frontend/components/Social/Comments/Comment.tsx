import {
  Avatar, Paper, Stack, styled, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import ReactMarkdown from 'react-markdown';
import Link from '~/components/Link';
import { timeAgo } from '~/functions/datetimeFunctions';
import { ArticleQuery } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import MemberSignature from '../MemberSignature';
import DeleteComment from './DeleteComment';

const CommentStack = styled(Stack)`
  * {
    margin: 0;
  }
`;

interface CommentProps {
  comment: ArticleQuery['article']['comments'][number];
}

export default function Comment({ comment }: CommentProps) {
  const { i18n } = useTranslation();
  const published = DateTime.fromISO(comment.published).setLocale(i18n.language);
  const { user } = useUser();
  const { hasAccess } = useApiAccess();
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Avatar src={comment.member.picture_path} />
      <Stack>
        <Paper elevation={2} style={{ borderRadius: '1rem' }}>
          <CommentStack
            padding={1.5}
          >
            <MemberSignature member={comment.member} fontSize="0.8em" />
            <ReactMarkdown
              components={{
                a: Link,
              }}
            >
              {comment.content}
            </ReactMarkdown>
          </CommentStack>
        </Paper>
        <Typography fontSize="0.75rem" marginLeft="0.9rem" marginTop="0.25rem">
          {timeAgo(published)}
        </Typography>
      </Stack>
      {(user?.id === comment?.member?.id || hasAccess('news:article:comment:delete')) && (
        <DeleteComment commentId={comment.id} />
      )}
    </Stack>
  );
}
