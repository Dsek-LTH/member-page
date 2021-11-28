import React from 'react';
import { Paper, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';
import { articleStyles } from './articlestyles';
import { DateTime } from 'luxon';
import Link from 'next/link';
import routes from '~/routes';
//@ts-ignore package does not have typescript types
import truncateMarkdown from 'markdown-truncate';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

type ArticleProps = {
  title: string;
  children: string;
  imageUrl: string | undefined;
  publishDate: string;
  author: string;
  authorId: number;
  id: string;
  fullArticle: boolean;
};

export default function Article(props: ArticleProps) {
  const classes = articleStyles();
  const date = DateTime.fromISO(props.publishDate);
  const { t, i18n } = useTranslation('common');
  const apiContext = useApiAccess();

  const children = props.children || '';

  let markdown = children;
  if (!props.fullArticle)
    markdown = truncateMarkdown(children, {
      limit: props.imageUrl ? 370 : 560,
      ellipsis: true,
    });

  return (
    <Paper className={classes.article} component={'article'}>
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
          lg={props.imageUrl ? 7 : 12}
          style={{ minHeight: '140px' }}
        >
          <Link href={routes.article(props.id)}>
            <MuiLink href={routes.article(props.id)}>
              <Typography variant="h3" className={classes.header}>
                {props.title}
              </Typography>
            </MuiLink>
          </Link>
          <ReactMarkdown children={markdown} />
        </Grid>

        {props.imageUrl && (
          <Grid item xs={12} md={12} lg={5} className={classes.imageGrid}>
            <img src={props.imageUrl} className={classes.image} alt="" />
          </Grid>
        )}

        <Grid item xs={12} className={classes.footer}>
          {markdown.length !== children.length && (
            <Link href={routes.article(props.id)} passHref>
              <MuiLink style={{ fontSize: '1.2em' }}>{t('read more')}</MuiLink>
            </Link>
          )}
          <br />
          <br />
          <span>{props.author}</span>
          <br />
          <span>{date.setLocale(i18n.language).toISODate()}</span>
          {hasAccess(apiContext, 'news:article:update') && (
            <>
              <br />
              <Link href={routes.editArticle(props.id)}>{t('edit')}</Link>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
