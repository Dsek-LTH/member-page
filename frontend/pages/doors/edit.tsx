import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetDoorsQuery, useRemoveDoorMutation } from '~/generated/graphql';
import Link from '~/components/Link';
import StrongYesNoDialog from '~/components/StrongYesNoDialog';

export default function EditDoorsPage() {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState<string>('');

  const { data, refetch: refetchDoors } = useGetDoorsQuery();
  const [removeDoor] = useRemoveDoorMutation();
  return (
    <Stack>
      <h2>Edit door access</h2>
      <Paper>
        <List>
          {data?.doors?.map((door, index) => (
            <React.Fragment key={door.name}>
              <StrongYesNoDialog
                textToConfirm={door.name}
                open={openDialog === door.name}
                setOpen={() => {
                  setOpenDialog(null);
                }}
                handleYes={() => {
                  removeDoor({
                    variables: { name: door.name },
                  }).then(() => {
                    refetchDoors();
                  });
                }}
              >
                {t('confirmRemoval')}
                {' '}
                {door.name}
                ?
              </StrongYesNoDialog>
              <ListItem
                key={door.name}
                secondaryAction={(
                  <Stack direction="row" spacing={2}>
                    <Link href={`/doors/${door.name}/edit`}>
                      <IconButton edge="end">
                        <BuildIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      edge="end"
                      onClick={(() => {
                        setOpenDialog(door.name);
                      })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              >
                <ListItemIcon>
                  <MeetingRoomIcon />
                </ListItemIcon>
                <ListItemText primary={door.name} />
              </ListItem>
              {index < data.doors.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
