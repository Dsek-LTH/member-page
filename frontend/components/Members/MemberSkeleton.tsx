import React from 'react';
import Grid from '@material-ui/core/Grid'
import { memberStyles } from './memberStyles'
import Typography from '@material-ui/core/Typography';
import UserAvatar from '../../components/UserAvatar';
import Skeleton from '@material-ui/core/Skeleton';

export default function MemberSkeleton() {
  const classes = memberStyles();

  return (
    <Grid
      container 
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start">
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <Typography variant='h4'><Skeleton /></Typography>
        <Typography variant='subtitle1' gutterBottom><Skeleton width={300} /></Typography>
        <Skeleton width={280} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4} >
        <Skeleton className={classes.skeletonImage} variant="circular">
          <UserAvatar centered src={''} size={36} />
        </Skeleton>
      </Grid>
    </Grid>
  )
}