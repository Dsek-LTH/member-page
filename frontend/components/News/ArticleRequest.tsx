import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import
{
  Box,
  Button,
  IconButton,
  Stack, Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import
{
  authorIsUser,
  getSignature,
} from '~/functions/authorFunctions';

import Article from '~/components/News/article';
import
{
  ArticleQuery,
  ArticleRequest as ArticleRequestType,
  useApproveRequestMutation, useRejectRequestMutation,
  useUndoRejectionMutation,
} from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import Link from '../Link';

type ArticleProps = {
  article: Omit<ArticleRequestType, 'author'> & { author: ArticleQuery['article']['author'] };
  refetch?: () => void;
  rejected?: boolean;
};

export default function ArticleRequest({
  article,
  refetch,
  rejected,
}: ArticleProps) {
  const { t } = useTranslation('common');
  const apiContext = useApiAccess();
  const { user } = useUser();

  const [approve] = useApproveRequestMutation({
    variables: {
      id: article.id,
    },
  });
  const [reject] = useRejectRequestMutation();
  const [undoRejection] = useUndoRejectionMutation({
    variables: {
      id: article.id,
    },
  });
  const fixedArticle: ArticleQuery['article'] = {
    ...article,
    __typename: 'Article',
    likers: [],
    isLikedByMe: false,
    comments: [],
  };

  return (
    <Article article={fixedArticle} fullArticle refetch={refetch}>
      {/* Rejected by / Edit button */}
      {'handledBy' in article ? (
        <Stack direction="row" justifyContent="space-between" gap={1}>
          <Stack>
            <Box>
              <span>
                {t('news:rejectedBy')}
                {' '}
              </span>
              <Link href={routes.member(article.handledBy.id)}>
                {getSignature(article.handledBy)}
              </Link>
            </Box>
            <Typography>
              {article.rejectionReason ? (
                <>
                  {t('news:rejectionReason')}
                  :
                  {' '}
                  <Typography fontStyle="italic" component="span">
                    {article.rejectionReason}
                  </Typography>
                </>
              ) : t('news:noRejectionReason')}
            </Typography>

          </Stack>
          {hasAccess(apiContext, 'news:article:manage') && (
            <Button
              variant="contained"
              onClick={async () => {
                undoRejection();
                refetch?.();
              }}
            >
              {t('news:undoRejection')}
            </Button>
          )}
        </Stack>
      ) : (hasAccess(apiContext, 'news:article:update')
      || authorIsUser(article.author, user)) && (
      <Link style={{ marginLeft: 'auto' }} href={routes.editArticle(article.id)}>
        <IconButton color="primary">
          <EditOutlinedIcon />
        </IconButton>
      </Link>
      )}

      {!rejected && hasAccess(apiContext, 'news:article:manage') && (
        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
          gap={2}
        >
          <Button
            variant="contained"
            onClick={async () => {
              await approve();
              refetch?.();
            }}
          >
            {t('news:approve')}
          </Button>
          <Button
            sx={{ px: 4 }}
            variant="contained"
            color="error"
            onClick={async () => {
              const reason = prompt('Why do you want to reject this article?');
              if (!reason) return;
              await reject({
                variables: {
                  id: article.id,
                  reason,
                },
              });
              refetch?.();
            }}
          >
            {t('news:reject')}
          </Button>
        </Stack>
      )}
    </Article>
  );
}
