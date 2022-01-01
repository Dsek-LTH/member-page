import React from 'react';
import { Avatar, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

interface UserAvatarProps {
  src: string;
  size: number;
  centered?: boolean;
  className?: string;
}
const useUserAvatarStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: ({ size, centered }: Partial<UserAvatarProps>) => ({
      height: theme.spacing(size),
      width: theme.spacing(size),
      margin: centered ? '0 auto' : '',
    }),
  }));
function UserAvatar({
  src, size, centered, className,
}: UserAvatarProps) {
  const classes = useUserAvatarStyles({ size, centered });
  return (
    <Avatar
      className={[classes.avatar, className].join(' ')}
      src={src}
    />
  );
}

export default UserAvatar;
