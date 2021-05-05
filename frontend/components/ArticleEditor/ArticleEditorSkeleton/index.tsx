import React from 'react';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/core/Skeleton';
import Typography from '@material-ui/core/Typography';
import { articleEditorSkeletonStyles } from './articleEditorSkeletonStyles';
import { Stack } from '@material-ui/core';

export default function ArticleEditorSkeleton() {
    const classes = articleEditorSkeletonStyles();

    return (
        <Paper className={classes.container}>
            <Stack spacing={2} >
                <Typography variant="h1"><Skeleton /></Typography>
                <Typography variant="h3"><Skeleton /></Typography>
                <Typography variant="h3"><Skeleton /></Typography>
                <Skeleton variant="rectangular" height={200} />

            </Stack>

        </Paper>
    )
}