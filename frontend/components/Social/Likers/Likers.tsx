import {
  Avatar,
  Dialog,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
  ListItem,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box } from '@material-ui/core';
import Link from '~/components/Link';
import { getFullName } from '~/functions/memberFunctions';
import { ArticleQuery } from '~/generated/graphql';
import routes from '~/routes';
import getLikers from './getLikers';

interface LikersProps {
  likers: ArticleQuery['article']['likers']
}

const LikersText = styled(Typography)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Likers({ likers }: LikersProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  // render an empty element for spacing and layout reasons
  if (!likers || likers.length === 0) return <Box />;

  return (
    <>
      <LikersText
        fontSize={14}
        color="GrayText"
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        {getLikers(likers, t)}
      </LikersText>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('likers')}</DialogTitle>
        <List>
          {likers.map((liker) => (
            <Link color="text.primary" href={routes.member(liker.student_id)} key={`likers${liker.id}`}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar src={liker.picture_path} />
                </ListItemAvatar>
                <ListItemText primary={getFullName(liker)} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Dialog>
    </>
  );
}
