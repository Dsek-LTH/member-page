import {
  Avatar, IconButton, Paper, Stack, styled, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import ReplyIcon from '@mui/icons-material/Reply';
import { timeAgo } from '~/functions/datetimeFunctions';
import { ArticleQuery, Member } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import MemberSignature from '../MemberSignature';
import DeleteComment from './DeleteComment';
import Markdown from '~/components/Markdown';

const CommentStack = styled(Stack)`
  * {
    margin: 0;
  }
  word-break: break-word;
`;

interface CommentProps {
  comment: ArticleQuery['article']['comments'][number];
  type: 'article' | 'event';
  onReply?: (user: Member) => void;
}

export default function Comment({ comment, type, onReply }: CommentProps) {
  const { i18n } = useTranslation();
  const published = DateTime.fromISO(comment.published).setLocale(i18n.language);
  const { user } = useUser();
  const { hasAccess } = useApiAccess();
  return (
    <Stack direction="row" gap={2} alignItems="flex-start" sx={{ overflow: 'hidden' }}>
      <Avatar src={comment.member.picture_path} sx={{ mt: 2 }} />
      <Stack>
        <Paper elevation={2}>
          <CommentStack
            padding={1.5}
          >
            <MemberSignature member={comment.member} fontSize="0.8em" />
            <Markdown content={comment.content} />
          </CommentStack>
        </Paper>
        <Typography fontSize="0.75rem" marginLeft="0.9rem" marginTop="0.25rem">
          {timeAgo(published)}
        </Typography>
      </Stack>
      {(onReply && hasAccess('news:article:comment')) && (
        <IconButton
          sx={{ mt: 2 }}
          onClick={() => {
            onReply(comment.member);
          }}
        >
          <ReplyIcon />
        </IconButton>
      )}
      {(user?.id === comment?.member?.id
       || (type === 'article' && hasAccess('news:article:comment:delete'))
       || (type === 'event' && hasAccess('event:comment:delete'))) && (
       <DeleteComment commentId={comment.id} type={type} />
      )}
    </Stack>
  );
}
