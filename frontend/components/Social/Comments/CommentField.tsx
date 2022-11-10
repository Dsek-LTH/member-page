/* eslint-disable react/jsx-no-duplicate-props */
import {
  Avatar, Stack,
} from '@mui/material';
import { MutableRefObject, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { MentionsInput, Mention } from 'react-mentions';
import { getFullName } from '~/functions/memberFunctions';
import { useCommentArticleMutation } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import { MemberHit } from '~/types/MemberHit';
import MentionsStyle from './MentionsStyle';

interface CommentFieldProps {
  id: string,
  commentInputRef: MutableRefObject<HTMLTextAreaElement>,
}

export default function CommentField({ id, commentInputRef }: CommentFieldProps) {
  const { user } = useUser();
  const { t } = useTranslation();
  const [commentArticle] = useCommentArticleMutation();
  const { hasAccess } = useApiAccess();
  const [comment, setComment] = useState('');
  const searchUrl = typeof window !== 'undefined' ? `${routes.searchApi}` : '';

  if (!hasAccess('news:article:comment')) {
    return null;
  }
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar src={user?.picture_path} />
      <MentionsInput
        className="mentions_input"
        style={MentionsStyle}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('write_a_comment')}
        maxLength={255}
        inputRef={commentInputRef}
        onKeyPress={(e) => {
          if (e.code === 'Enter') {
            if (e.ctrlKey || e.shiftKey) setComment((state) => `${state}\n\n`);
            else if (comment.trim().length > 0) {
              e.preventDefault();
              commentArticle({
                variables: {
                  id,
                  content:
                 comment.trim().replaceAll('@[@', '[@'),
                },
              }).then(() => {
                setComment('');
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
    </Stack>
  );
}
