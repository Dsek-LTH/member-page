import React from 'react';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/core/Skeleton';
import { Stack } from '@material-ui/core';

export default function MemberEditorSkeleton() {

    return (
        <Stack spacing={2} >
            <Typography variant="h1"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
        </Stack>
    )
}