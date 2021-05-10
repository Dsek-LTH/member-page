import React from 'react';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/core/Skeleton';
import Typography from '@material-ui/core/Typography';
import { Stack } from '@material-ui/core';

export default function ArticleEditorSkeleton() {

    return (
            <Stack spacing={2} >
                <Typography variant="h1"><Skeleton /></Typography>
                <Typography variant="h3"><Skeleton /></Typography>
                <Typography variant="h3"><Skeleton /></Typography>
                <Skeleton variant="rectangular" height={200} />
            </Stack>
    )
}