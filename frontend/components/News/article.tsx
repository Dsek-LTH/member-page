import React from 'react';
import {
  Paper,
  Link as MuiLink,
  Typography,
  Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { DateTime } from 'luxon';
import Link from 'next/link';
import Image from 'next/image';
import truncateMarkdown from 'markdown-truncate';
import routes from '~/routes';
import articleStyles from './articleStyles';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { ArticleQuery, useDislikeArticleMutation, useLikeArticleMutation } from '~/generated/graphql';
import selectTranslation from '~/functions/selectTranslation';
import { getSignature } from '~/functions/authorFunctions';
import Like from '../Like';

type ArticleProps = {
  article: ArticleQuery['article'];
  refetch: () => void;
  fullArticle: boolean;
};

function MarkdownLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <Link href={href} passHref>
      <MuiLink>{children}</MuiLink>
    </Link>
  );
}

export default function Article({ article, fullArticle, refetch }: ArticleProps) {
  const classes = articleStyles();
  const date = DateTime.fromISO(article.publishedDatetime);
  const { t, i18n } = useTranslation('common');
  const apiContext = useApiAccess();

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
          <Link href={routes.article(article.id)} passHref>
            <MuiLink>
              <Typography variant="h3" className={classes.header}>
                {selectTranslation(i18n, article.header, article.headerEn)}
              </Typography>
            </MuiLink>
          </Link>
          <ReactMarkdown
            components={{
              a: MarkdownLink,
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
                <Link href={routes.article(article.id)} passHref>
                  <MuiLink style={{ fontSize: '1.2em' }}>
                    {t('read more')}
                  </MuiLink>
                </Link>
            )}
            <Typography variant="body2">
              {getSignature(article.author)}
            </Typography>
            <Typography variant="body2">
              {date.setLocale(i18n.language).toISODate()}
            </Typography>
            {hasAccess(apiContext, 'news:article:update') && (
              <Link href={routes.editArticle(article.id)} passHref>
                <MuiLink>{t('edit')}</MuiLink>
              </Link>
            )}
          </Stack>
          <Like
            likes={article.likes}
            isLikedByMe={article.isLikedByMe}
            tooltip={t('likeTooltip')}
            toggleLike={() => toggleLike()}
          />
        </Stack>
      </Grid>
    </Paper>
  );
}
