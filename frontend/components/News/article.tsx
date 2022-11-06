import {
  Avatar, Paper, Stack, Typography, Box, IconButton, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTime } from 'luxon';
import Image from 'next/image';
import truncateMarkdown from 'markdown-truncate';
import { useTranslation } from 'next-i18next';
import ReactMarkdown from 'react-markdown';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useRef } from 'react';
import selectTranslation from '~/functions/selectTranslation';
import { ArticleQuery, useUnlikeArticleMutation, useLikeArticleMutation } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import LikeButton from '../Social/LikeButton';
import Tag from '../Tag';
import articleStyles from './articleStyles';
import {
  authorIsUser,
  getAuthor,
  getAuthorStudentId,
  getSignature,
} from '~/functions/authorFunctions';
import { useUser } from '~/providers/UserProvider';
import Link from '../Link';
import CommentButton from '../Social/CommentButton';
import Comments from '../Social/Comments/Comments';
import { timeAgo } from '~/functions/datetimeFunctions';

type ArticleProps = {
  article: ArticleQuery['article'];
  refetch: () => void;
  fullArticle: boolean;
};

export default function Article({
  article,
  fullArticle,
  refetch,
}: ArticleProps) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation('common');
  const date = DateTime.fromISO(article.publishedDatetime).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const { user } = useUser();
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [likeArticleMutation] = useLikeArticleMutation({
    variables: {
      id: article.id,
    },
  });

  const [unlikeArticleMutation] = useUnlikeArticleMutation({
    variables: {
      id: article.id,
    },
  });

  function toggleLike() {
    if (article.isLikedByMe) {
      unlikeArticleMutation().then(() => refetch());
    } else {
      likeArticleMutation().then(() => refetch());
    }
  }

  let markdown = selectTranslation(i18n, article.body, article.bodyEn);
  if (!fullArticle) {
    markdown = truncateMarkdown(markdown, {
      limit: article.imageUrl ? 370 : 560,
      ellipsis: true,
    });
  }

  return (
    <Paper className={classes.article} component="article">
      <Stack>
        <Grid
          className={classes.bodyGrid}
          item
          xs={12}
          md={12}
          lg={article.imageUrl ? 7 : 12}
          style={{ minHeight: '140px' }}
        >
          <Stack direction="row" spacing={1}>
            <Link href={routes.member(getAuthorStudentId(article.author))}>
              <Avatar src={getAuthor(article.author)?.picture_path} />
            </Link>
            <Stack>
              <Link
                href={routes.member(getAuthorStudentId(article.author))}
                style={{ whiteSpace: 'break-spaces' }}
              >
                {getSignature(article.author)}
              </Link>
              {/* {date.setLocale(i18n.language).toLocaleString(DateTime.DATETIME_SHORT)} */}
              {timeAgo(date)}
              <Typography variant="body2" />
            </Stack>
            {(hasAccess(apiContext, 'news:article:update')
              || authorIsUser(article.author, user)) && (
              <Link style={{ marginLeft: 'auto' }} href={routes.editArticle(article.id)}>
                <IconButton color="primary">
                  <EditOutlinedIcon />
                </IconButton>
              </Link>
            )}
          </Stack>
          <Link href={routes.article(article.slug || article.id)}>
            <Typography variant="h3" className={classes.header}>
              {selectTranslation(i18n, article.header, article.headerEn)}
            </Typography>
          </Link>
          <Box flexDirection="row" flexWrap="wrap">
            {article.tags.map((tag) => (<Tag key={tag.id} tag={tag} />
            ))}
          </Box>
          <ReactMarkdown
            components={{
              a: Link,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </Grid>

        {article.imageUrl && (
          <Grid item xs={12} md={12} lg={5} className={classes.imageGrid}>
            <Image src={article.imageUrl} className={classes.image} alt="" />
          </Grid>
        )}

        {markdown.length !== selectTranslation(i18n, article.body, article.bodyEn).length && (
          <Link href={routes.article(article.id)}>{t('read more')}</Link>
        )}

        <Divider style={{ margin: '0.75rem 0' }} />

        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="space-around"
        >
          <LikeButton
            isLikedByMe={article.isLikedByMe}
            tooltip={t('likeTooltip')}
            toggleLike={() => toggleLike()}
            access="news:article:like"
          />
          <CommentButton toggleComment={() => commentInputRef.current.focus()} access="news:article:comment" />
        </Stack>

        <Divider style={{ margin: '0.75rem 0' }} />

        <Comments id={article.id} comments={article.comments} commentInputRef={commentInputRef} />

      </Stack>
    </Paper>
  );
}
