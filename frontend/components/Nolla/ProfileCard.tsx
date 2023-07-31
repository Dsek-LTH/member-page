import {
  Card, CardContent, CardMedia, Typography,
} from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import React from 'react';

type Props = {
  image: string;
  name: React.ReactNode;
  desc: React.ReactNode;
  offset?: ResponsiveStyleValue<number | string>;
};
function ProfileCard({
  image, name, desc, offset = '10%',
}: Props) {
  return (
    <Card
      sx={(t) => ({
        maxWidth: '35ch',
        border: '1px solid hsla(317, 82%, 56%, 0.25)',
        borderTop: `5px solid ${t.palette.primary.main}`,
        boxShadow: '5px 5px 20px hsla(317, 82%, 56%, 0.1)',
      })}
    >
      <CardMedia
        sx={{ height: [200, 400], backgroundPositionY: offset }}
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {desc}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
