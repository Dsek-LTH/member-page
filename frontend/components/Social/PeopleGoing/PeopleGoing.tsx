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
import Link from '~/components/Link';
import { getFullName } from '~/functions/memberFunctions';
import { EventQuery } from '~/generated/graphql';
import routes from '~/routes';
import getPeopleGoing from './getPeopleGoing';

interface PeopleGoingProps {
  peopleGoing: EventQuery['event']['peopleGoing'],
}

const PeopleGoingText = styled(Typography)`
  cursor: pointer;
  color: pink;
  &:hover {
    text-decoration: underline;
  }
`;

export default function PeopleGoing({ peopleGoing }: PeopleGoingProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!peopleGoing || peopleGoing.length === 0) return null;

  return (
    <>
      <PeopleGoingText
        fontSize={14}
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        {getPeopleGoing(peopleGoing, t)}
      </PeopleGoingText>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('event:people_going')}</DialogTitle>
        <List>
          {peopleGoing.map((liker) => (
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
