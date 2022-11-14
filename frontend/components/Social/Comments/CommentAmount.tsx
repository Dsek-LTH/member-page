import
{
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ArticleQuery } from '~/generated/graphql';

interface CommentAmountProps {
  comments: ArticleQuery['article']['comments']
}

export default function CommentAmount({ comments }: CommentAmountProps) {
  const { t } = useTranslation();

  if (!comments || comments.length === 0) return null;

  return (
    <Typography
      fontSize={14}
      color="GrayText"
    >
      {comments.length}
      {' '}
      {comments.length > 1 ? t('many_comments') : t('one_comment')}
    </Typography>
  );
}
