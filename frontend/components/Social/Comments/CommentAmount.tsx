import
{
  styled,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ArticleQuery } from '~/generated/graphql';

interface CommentAmountProps {
  comments: ArticleQuery['article']['comments']
  onClick?: () => void;
}

const Text = styled(Typography)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default function CommentAmount({ comments, onClick }: CommentAmountProps) {
  const { t } = useTranslation();

  if (!comments || comments.length === 0) return null;

  return (
    <Text
      fontSize={14}
      style={{ color: 'rgb(128, 128, 128)' }}
      onClick={onClick}
    >
      {comments.length}
      {' '}
      {comments.length > 1 ? t('many_comments') : t('one_comment')}
    </Text>
  );
}
