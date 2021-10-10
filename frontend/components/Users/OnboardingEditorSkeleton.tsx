import React from 'react';
import {Typography, Skeleton, Stack} from '@mui/material';

export default function OnboardingEditorSkeleton() {

    return (
        <Stack spacing={2} >
            <Typography variant="h3"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
            <Typography variant="h3"><Skeleton /></Typography>
        </Stack>
    )
}