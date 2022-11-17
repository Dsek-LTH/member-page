/* eslint-disable react/jsx-no-duplicate-props */
import {
  Avatar, Stack,
} from '@mui/material';
import { MutableRefObject, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { MentionsInput, Mention } from 'react-mentions';
import { getFullName } from '~/functions/memberFunctions';
import { useCommentArticleMutation, useCommentEventMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import { MemberHit } from '~/types/MemberHit';
import MentionsStyle from './MentionsStyle';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@material-ui/core/Button';

interface CommentFieldProps {
  id: string,
  type: 'article' | 'event',
  commentInputRef: MutableRefObject<HTMLTextAreaElement>,
}

export default function CommentField({ id, type, commentInputRef }: CommentFieldProps) {
  const { user } = useUser();
  const { t } = useTranslation();
  const [commentArticle] = useCommentArticleMutation();
  const [commentEvent] = useCommentEventMutation();
  const { hasAccess } = useApiAccess();
  const [content, setContent] = useState('');
  const searchUrl = typeof window !== 'undefined' ? `${routes.searchApi}` : '';

  const comment = (variables: { id: string, content: string }) => {
    if (type === 'article') {
      return commentArticle({ variables });
    }
    return commentEvent({ variables });
  };

  if ((type === 'article' && !hasAccess('news:article:comment')) || (type === 'event' && !hasAccess('event:comment'))) {
    return null;
  }
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar src={user?.picture_path} />
      <MentionsInput
        className="mentions_input"
        style={MentionsStyle}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('write_a_comment')}
        maxLength={255}
        inputRef={commentInputRef}
        onKeyPress={(e) => {
          if (e.code === 'Enter') {
            if (e.ctrlKey || e.shiftKey) setContent((state) => `${state}\n\n`);
            else if (content.trim().length > 0) {
              e.preventDefault();
              comment({
                id,
                content:
                 content.trim().replaceAll('@[@', '[@'),

              }).then(() => {
                setContent('');
              });
            }
          }
        }}
      >
        <Mention
          trigger="@"
          data={async (query, callback) => {
            if (query.length === 1) {
              callback([]);
            }
            const res = await fetch(`${searchUrl}?q=${query}`);
            const data = await res.json();
            const members = data.hits as MemberHit[];
            callback(members.map((m) => ({ ...m, id: routes.member(m.student_id), display: `@${getFullName(m)}` })));
          }}
        />
      </MentionsInput>
      <IconButton onClick={(e) => {
        e.preventDefault();
              comment({
                id,
                content:
                 content.trim().replaceAll('@[@', '[@'),

              }).then(() => {
                setContent('');
              });
      }}>
        <SendIcon />
      </IconButton>
    </Stack>
  );
}
