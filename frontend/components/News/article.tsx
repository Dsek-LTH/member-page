import React from 'react';
import { Paper, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { DateTime } from 'luxon';
import Link from 'next/link';
import truncateMarkdown from 'markdown-truncate';
import routes from '~/routes';
import articleStyles from './articleStyles';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

type ArticleProps = {
  title: string;
  children: string;
  imageUrl: string | undefined;
  publishDate: string;
  author: string;
  id: string;
  fullArticle: boolean;
};

function MarkdownLink({ children, href }: { children: React.ReactNode; href?: string }) {
  return <Link href={href}><MuiLink href={href}>{children}</MuiLink></Link>;
}

export default function Article({
  title,
  children,
  imageUrl,
  publishDate,
  author,
  id,
  fullArticle,
}: ArticleProps) {
  const classes = articleStyles();
  const date = DateTime.fromISO(publishDate);
  const { t, i18n } = useTranslation('common');
  const apiContext = useApiAccess();

  let markdown = children;
  if (!fullArticle) {
    markdown = truncateMarkdown(children, {
      limit: imageUrl ? 370 : 560,
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
          lg={imageUrl ? 7 : 12}
          style={{ minHeight: '140px' }}
        >
          <Link href={routes.article(id)}>
            <MuiLink href={routes.article(id)}>
              <Typography variant="h3" className={classes.header}>
                {title}
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

        {imageUrl && (
          <Grid item xs={12} md={12} lg={5} className={classes.imageGrid}>
            <img src={imageUrl} className={classes.image} alt="" />
          </Grid>
        )}

        <Grid item xs={12} className={classes.footer}>
          {markdown.length !== children.length && (
            <Link href={routes.article(id)} passHref>
              <MuiLink style={{ fontSize: '1.2em' }}>{t('read more')}</MuiLink>
            </Link>
          )}
          <br />
          <br />
          <span>{author}</span>
          <br />
          <span>{date.setLocale(i18n.language).toISODate()}</span>
          {hasAccess(apiContext, 'news:article:update') && (
            <>
              <br />
              <Link href={routes.editArticle(id)}><MuiLink href={routes.editArticle(id)}>{t('edit')}</MuiLink></Link>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
