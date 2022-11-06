/* eslint-disable react/jsx-no-duplicate-props */
import { Avatar, Stack, TextField } from '@mui/material';
import { MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import Form from '~/components/Form';
import { useCommentArticleMutation } from '~/generated/graphql';
import { useUser } from '~/providers/UserProvider';

interface CommentFieldProps {
  id: string,
  commentInputRef: MutableRefObject<HTMLInputElement>
}

export default function CommentField({ id, commentInputRef }: CommentFieldProps) {
  const { user } = useUser();
  const { t } = useTranslation();
  const [commentArticle] = useCommentArticleMutation();
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar src={user?.picture_path} />
      <Form onSubmit={() =>
        commentArticle({ variables: { id, content: commentInputRef.current.value } }).then(() => {
          // eslint-disable-next-line no-param-reassign
          commentInputRef.current.value = '';
        })}
      >

        <TextField
          placeholder={t('write_a_comment')}
          inputRef={commentInputRef}
          fullWidth
          inputProps={{ style: { padding: '0.5rem 1rem' } }}
          InputProps={{ style: { borderRadius: '10rem' } }}
        />
      </Form>
    </Stack>
  );
}
