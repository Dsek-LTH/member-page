import React from 'react';
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import { memberStyles } from './memberStyles'
import Typography from '@material-ui/core/Typography';
import UserAvatar from '../../components/UserAvatar';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import SchoolIcon from '@material-ui/icons/School';

type MemberProps = {
    name: string;
    classYear: string;
    student_id: string;
    picture_path: string;
}

export default function Member(props: MemberProps) {
    const classes = memberStyles();

    return (
        <Paper className={classes.member}>
            <Grid
              container
              spacing={3}
              direction="row"
              justifyContent="center"
              alignItems="flex-start">
              <Grid item xs={12} sm={12} md={12} lg={8}>
                <Typography variant='h4'> {props.name} </Typography>
                <Typography variant='subtitle1' gutterBottom>{props.student_id}</Typography>
                <List component="div">
                  <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                    <ListItemText primary={props.classYear} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} >
                <UserAvatar centered src={props.picture_path} size={36}/>
              </Grid>
            </Grid>
        </Paper>
    )
}