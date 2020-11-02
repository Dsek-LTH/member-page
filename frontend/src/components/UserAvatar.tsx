import React from 'react';
import {
  Avatar,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core';

interface UserAvatarProps {
  src: string;
  size: number;
}
const useUserAvatarStyles = makeStyles((theme: Theme) => createStyles({
  avatar: ({ size }: UserAvatarProps) => ({
    height: theme.spacing(size),
    width: theme.spacing(size),
    margin: '0 auto',
  })
})
);
function UserAvatar(props: UserAvatarProps) {
  const classes = useUserAvatarStyles(props);
  return (
    <Avatar className={classes.avatar} src={props.src} />
  );
}

export default UserAvatar;