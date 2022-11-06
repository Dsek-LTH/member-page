import {
  Avatar, Paper, Stack, Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { timeAgo } from '~/functions/datetimeFunctions';
import { ArticleQuery } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import MemberSignature from '../MemberSignature';
import DeleteComment from './DeleteComment';

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
          <Stack padding={1.5}>
            <MemberSignature member={comment.member} fontSize="0.95rem" />
            <Typography margin="0.5rem 0">
              {comment.content}
            </Typography>
          </Stack>
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
