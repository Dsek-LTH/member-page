import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown'
import { makeStyles } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import { useTheme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';
//@ts-ignore package does not have typescript types
import truncateMarkdown from 'markdown-truncate'


type ArticleProps = {
    title: string,
    children: string,
    image_url: string | undefined,
    publish_date: string,
    author: string,
    id: string,
    full_article: boolean,
}
export default function Article(props: ArticleProps) {
    const theme = useTheme()

    const useStyles = makeStyles({
        article: {
            color: "#454545",
            fontSize: "1em",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "10px",
            '& code': {
                display: "block",
                overflow: "auto",
            },
        },
        header: {
            color: "#706072",
            fontWeight: 500,
            marginBlockStart: 0,
            marginBlockEnd: 0,
            fontSize: "2em",
            textOverflow: "ellipsis",
            overflow: "hidden",
            height: "1.5em",
            whiteSpace: "nowrap",
            [theme.breakpoints.down('xs')]: {
                fontSize: "1.7em"
              },
        },
        image_grid: {
            textAlign: "center",
        },
        image: {
            maxWidth: "200px",
            height: "200px",
            borderRadius: "20px",
            objectFit: "cover",
            [theme.breakpoints.up('lg')]: {
                position: "absolute",
                top: "0",
                bottom: "0",
                right: "0",
                margin: "auto",
            },
            [theme.breakpoints.down('md')]: {
                maxWidth: "80%",
            },
        }, 
        footer: {
            color: "#706072",
            fontSize: "0.8em",
            marginTop: "5px"
        },
    });

    const date = DateTime.fromISO(props.publish_date)
    const date_format = { month: 'long', day: 'numeric', year: 'numeric' };
    const classes = useStyles();
    let markdown = props.children;
    if(!props.full_article)
        markdown = truncateMarkdown(props.children, { limit: props.image_url ? 370 : 560, ellipsis: true })
    
    return (
        <Paper className={classes.article}>
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="flex-start"
                style={{ position: "relative" }}
            >
                <Grid item xs={12} md={12} lg={props.image_url ? 7 : 12} style={{ minHeight: "140px" }}>
                    <h3 className={classes.header}>{props.title}</h3>
                    <ReactMarkdown children={markdown} />
                </Grid>

                {props.image_url ? (
                    <Grid item xs={12} md={12} lg={5} className={classes.image_grid}>
                        <img src={props.image_url} className={classes.image} alt=""/>
                    </Grid>
                )
                    : ""
                }

                <Grid item xs={12} className={classes.footer}>
                    {markdown.length !== props.children.length ? <Link to={`nyheter/artikel/${props.id}`} style={{ fontSize: "1.2em" }}>Läs mer</Link> : ""}<br /><br />
                    <span>{props.author}</span><br />
                    <span>{date.setLocale('sv').toLocaleString(date_format)}</span>
                </Grid>
            </Grid>
        </Paper>
    )
}