import React, { useContext } from 'react';
import { Paper } from '@material-ui/core';
import { useTranslation } from 'next-i18next';
import Grid from '@material-ui/core/Grid'
import ReactMarkdown from 'react-markdown'
import { articleStyles } from './articlestyles'
import { DateTime } from 'luxon';
import Link from 'next/link';
import routes from '~/routes';
//@ts-ignore package does not have typescript types
import truncateMarkdown from 'markdown-truncate';
import UserContext from '~/providers/UserProvider';

type ArticleProps = {
    title: string,
    children: string,
    imageUrl: string | undefined,
    publishDate: string,
    author: string,
    authorId: number,
    id: string,
    fullArticle: boolean,
}

export default function Article(props: ArticleProps) {
    const classes = articleStyles();
    const date = DateTime.fromISO(props.publishDate);
    const { t } = useTranslation('common');
    const { user, loading: userLoading } = useContext(UserContext);

    let markdown = props.children;
    if (!props.fullArticle)
        markdown = truncateMarkdown(props.children, { limit: props.imageUrl ? 370 : 560, ellipsis: true })

    return (
        <Paper className={classes.article}>
            <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="flex-start"
                style={{ position: "relative" }}
            >
                <Grid item xs={12} md={12} lg={props.imageUrl ? 7 : 12} style={{ minHeight: "140px" }}>
                    <h3 className={classes.header}>{props.title}</h3>
                    <ReactMarkdown children={markdown} />
                </Grid>

                {props.imageUrl && (
                    <Grid item xs={12} md={12} lg={5} className={classes.imageGrid}>
                        <img src={props.imageUrl} className={classes.image} alt="" />
                    </Grid>
                )}

                <Grid item xs={12} className={classes.footer}>
                    {markdown.length !== props.children.length && <Link href={routes.article(props.id)}><a style={{ fontSize: "1.2em" }}>{t('read more')}</a></Link>}
                    <br /><br />
                    <span>{props.author}</span><br />
                    <span>{date.setLocale('sv').toISODate()}</span>

                    {!userLoading && user?.id == props.authorId && (<>
                        <br />
                        <Link href={routes.editArticle(props.id)}>
                            {t('edit')}
                        </Link>
                    </>)}

                </Grid>
            </Grid>
        </Paper>
    )
}