import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import
{
  Avatar, Box,
  Button,
  IconButton, Paper, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRef } from 'react';
import Markdown from '~/components/Markdown';
import
{
  authorIsUser,
  getAuthor,
  getAuthorStudentId,
  getSignature,
} from '~/functions/authorFunctions';

import { timeAgo } from '~/functions/datetimeFunctions';
import selectTranslation from '~/functions/selectTranslation';
import
{
  ArticleRequestsQuery, useApproveRequestMutation, useRejectRequestMutation,
} from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import Link from '../Link';
import Tag from '../Tag';
import articleStyles from './articleStyles';

type ArticleProps = {
  article: ArticleRequestsQuery['articleRequests'][number];
  refetch: () => void;
};

export default function ArticleRequest({
  article,
  refetch,
}: ArticleProps) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation('common');
  const date = DateTime.fromISO(article.createdDatetime).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const { user } = useUser();
  const markdownRef = useRef<HTMLDivElement>(null);

  const markdown = selectTranslation(i18n, article.body, article.bodyEn);
  const [approve] = useApproveRequestMutation({
    variables: {
      id: article.id,
    },
  });
  const [reject] = useRejectRequestMutation();

  return (
    <Paper className={classes.article} component="article">
      <Stack>
        <Grid
          className={classes.bodyGrid}
          item
          xs={12}
          md={12}
          lg={article.imageUrl ? 7 : 12}
        >
          {/* Top part */}
          <Stack direction="row" spacing={1}>

            {/* Avatar and name */}
            <Link href={routes.member(getAuthorStudentId(article.author))}>
              <Avatar
                src={getAuthor(article.author)?.picture_path}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </Link>
            <Stack spacing={0.5}>
              <Link
                href={routes.member(getAuthorStudentId(article.author))}
              >
                {getSignature(article.author)}
              </Link>
              <Typography>
                {timeAgo(date)}
              </Typography>
            </Stack>

            {/* Edit button */}
            {(hasAccess(apiContext, 'news:article:update')
              || authorIsUser(article.author, user)) && (
              <Link style={{ marginLeft: 'auto' }} href={routes.editArticle(article.id)}>
                <IconButton color="primary">
                  <EditOutlinedIcon />
                </IconButton>
              </Link>
            )}
          </Stack>

          {/* Header */}
          <Link href={routes.article(article.slug || article.id)}>
            <Typography variant="h5" className={classes.header}>
              {selectTranslation(i18n, article.header, article.headerEn)}
            </Typography>
          </Link>
          {(article.imageUrl) && (
          <div style={{
            position: 'relative', height: '300px', width: '100%', margin: '1rem 0',
          }}
          >
            <Image
              layout="fill"
              src={article.imageUrl}
              objectFit="cover"
              style={{
                borderRadius: '20px',
              }}
              alt=""
            />
          </div>
          )}
          {/* Tags */}
          {article.tags.length > 0 && (
            <Box flexDirection="row" flexWrap="wrap">
              {article.tags.map((tag) => (<Tag key={tag.id} tag={tag} />
              ))}
            </Box>
          )}
          {/* Body */}
          <Box
            ref={markdownRef}
          >
            <Markdown content={markdown} />
          </Box>
        </Grid>
        {hasAccess(apiContext, 'news:article:manage') && (
        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            onClick={async () => {
              await approve();
              refetch();
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const reason = prompt('Why do you want to reject this article?');
              await reject({
                variables: {
                  id: article.id,
                  reason,
                },
              });
              refetch();
            }}
          >
            Reject
          </Button>
        </Stack>
        )}

      </Stack>
    </Paper>
  );
}
