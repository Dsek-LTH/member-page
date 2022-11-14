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
import getPeopleInterested from './getPeopleInterested';

interface PeopleInterestedProps {
  peopleInterested: EventQuery['event']['peopleInterested'],
}

const PeopleInterestedText = styled(Typography)`
  cursor: pointer;
  color: pink;
  &:hover {
    text-decoration: underline;
  }
`;

export default function PeopleInterested({ peopleInterested }: PeopleInterestedProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!peopleInterested || peopleInterested.length === 0) return null;

  return (
    <>
      <PeopleInterestedText
        fontSize={14}
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        {getPeopleInterested(peopleInterested, t)}
      </PeopleInterestedText>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('event:people_interested')}</DialogTitle>
        <List>
          {peopleInterested.map((liker) => (
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
