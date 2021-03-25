import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown'
import { articleStyles } from './articlestyles'
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
//@ts-ignore package does not have typescript types
import truncateMarkdown from 'markdown-truncate'

type ArticleProps = {
    title: string,
    children: string,
    imageUrl: string | undefined,
    publishDate: string,
    author: string,
    id: string,
    fullArticle: boolean,
}

export default function Article(props: ArticleProps) {
    const classes = articleStyles()
    const date = DateTime.fromISO(props.publishDate)
    const date_format = { month: 'long', day: 'numeric', year: 'numeric' };

    let markdown = props.children;
    if (!props.fullArticle)
        markdown = truncateMarkdown(props.children, { limit: props.imageUrl ? 370 : 560, ellipsis: true })

    return (
        <Paper className={classes.article}>
            <Grid
                container
                direction="row"
                justify="space-evenly"
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
                    {markdown.length !== props.children.length && <Link to={`nyheter/artikel/${props.id}`} style={{ fontSize: "1.2em" }}>Läs mer</Link>}
                    <br /><br />
                    <span>{props.author}</span><br />
                    <span>{date.setLocale('sv').toLocaleString(date_format)}</span>
                </Grid>
            </Grid>
        </Paper>
    )
}