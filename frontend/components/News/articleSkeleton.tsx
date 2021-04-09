import React from 'react';
import Grid from '@material-ui/core/Grid'
import { articleStyles } from './articlestyles'
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/core/Skeleton';
import Typography from '@material-ui/core/Typography';


export default function ArticleSkeleton() {
    const classes = articleStyles();

    return (
        <Paper className={classes.article}>
            <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="flex-start"
                style={{ position: "relative" }}
            >
                <Grid item xs={12} md={12} lg={7} style={{ minHeight: "140px" }}>
                    <Typography variant="h3"><Skeleton /></Typography>
                    <Skeleton />
                    <Skeleton />
                </Grid>


                <Grid item xs={12} md={12} lg={5} className={classes.imageGrid}>'
                    <Skeleton variant="rectangular" className={classes.image} width={200} height={200} />
                </Grid>

                <Grid item xs={12} className={classes.footer}>
                    <br />
                    <br />
                    <Typography variant="body1"  >
                        <Skeleton width={200} />
                    </Typography>
                    <Typography variant="body1"  >
                        <Skeleton width={200} />
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}