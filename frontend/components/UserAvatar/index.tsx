import React from 'react';
import {
  Avatar,
  Theme
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

interface UserAvatarProps {
  src: string;
  size: number;
  centered?: boolean;
  className?: string;
}
const useUserAvatarStyles = makeStyles((theme: Theme) => createStyles({
  avatar: ({ size, centered }: UserAvatarProps) => ({
    height: theme.spacing(size),
    width: theme.spacing(size),
    margin: centered ? '0 auto' : '',
  })
})
);
function UserAvatar(props: UserAvatarProps) {
  const classes = useUserAvatarStyles(props);
  return (
    <Avatar className={ [classes.avatar, props.className].join(' ') } src={props.src} />
  );
}

export default UserAvatar;