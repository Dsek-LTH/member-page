import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { DateTime } from 'luxon';
import Image from 'next/image';
import truncateMarkdown from 'markdown-truncate';
import routes from '~/routes';
import articleStyles from './articleStyles';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { ArticleQuery, useDislikeArticleMutation, useLikeArticleMutation } from '~/generated/graphql';
import selectTranslation from '~/functions/selectTranslation';
import {
  authorIsUser, getAuthor, getAuthorId, getSignature,
} from '~/functions/authorFunctions';
import Like from '../Like';
import { useUser } from '~/providers/UserProvider';
import Link from '../Link';

type ArticleProps = {
  article: ArticleQuery['article'];
  refetch: () => void;
  fullArticle: boolean;
};

export default function Article({ article, fullArticle, refetch }: ArticleProps) {
  const classes = articleStyles();
  const date = DateTime.fromISO(article.publishedDatetime);
  const { t, i18n } = useTranslation('common');
  const apiContext = useApiAccess();
  const { user } = useUser();
  const [likeArticleMutation] = useLikeArticleMutation({
    variables: {
      id: article.id,
    },
  });

  const [dislikeArticleMutation] = useDislikeArticleMutation({
    variables: {
      id: article.id,
    },
  });

  function toggleLike() {
    if (article.isLikedByMe) {
      dislikeArticleMutation().then(() => refetch());
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
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
        style={{ position: 'relative' }}
      >
        <Grid
          className={classes.bodyGrid}
          item
          xs={12}
          md={12}
          lg={article.imageUrl ? 7 : 12}
          style={{ minHeight: '140px' }}
        >
          <Link href={routes.article(article.id)}>
            <Typography variant="h3" className={classes.header}>
              {selectTranslation(i18n, article.header, article.headerEn)}
            </Typography>
          </Link>
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

        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            {markdown.length
              !== selectTranslation(i18n, article.body, article.bodyEn).length && (
                <Link href={routes.article(article.id)}>
                    {t('read more')}
                </Link>
            )}
            <Stack direction="row" spacing={1}>
              <Link href={routes.member(getAuthorId(article.author))}>
                <Avatar src={getAuthor(article.author)?.picture_path} />
              </Link>
              <Stack>
                <Link href={routes.member(getAuthorId(article.author))}>
                  {getSignature(article.author)}
                </Link>
                {date.setLocale(i18n.language).toISODate()}
                <Typography variant="body2" />
              </Stack>
            </Stack>
            {(hasAccess(apiContext, 'news:article:update') || authorIsUser(article.author, user)) && (
              <Link href={routes.editArticle(article.id)}>
                {t('edit')}
              </Link>
            )}
          </Stack>
          <Like
            likes={article.likes}
            isLikedByMe={article.isLikedByMe}
            tooltip={t('likeTooltip')}
            toggleLike={() => toggleLike()}
            access="news:article:like"
          />
        </Stack>
      </Grid>
    </Paper>
  );
}
