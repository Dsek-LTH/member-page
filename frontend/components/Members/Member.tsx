import React from 'react';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { memberStyles } from './memberStyles';
import Typography from '@mui/material/Typography';
import UserAvatar from '../../components/UserAvatar';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import SchoolIcon from '@mui/icons-material/School';

type MemberProps = {
  name: string;
  classYear: string;
  student_id: string;
  picture_path: string;
};

export default function Member(props: MemberProps) {
  const classes = memberStyles();

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <Typography variant="h4"> {props.name} </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {props.student_id}
        </Typography>
        <List component="div">
          <ListItem>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary={props.classYear} />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4}>
        <UserAvatar centered src={props.picture_path} size={36} />
      </Grid>
    </Grid>
  );
}
