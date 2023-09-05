import { Paper, Stack, Typography } from '@mui/material';

export type MessageType = {
  content: string;
  sentByYou: boolean;
  color: string;
};

export default function Message({ message }: { message: MessageType }) {
  return (
    <Paper
      elevation={3}
      style={{
        width: 'fit-content',
        marginLeft: message.sentByYou ? 'auto' : undefined,
      }}
    >
      <Stack
        padding={2}
        style={{
          width: 'fit-content',
        }}
      >
        <Typography
          style={{
            color: message.color,
          }}
        >
          {message.sentByYou ? 'Du: ' : 'Boss: '}
          {message.content}
        </Typography>
      </Stack>
    </Paper>
  );
}
