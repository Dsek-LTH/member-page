import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import
{
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Link from '~/components/Link';
import StrongConfirmDialog from '~/components/StrongConfirmDialog';
import genGetProps from '~/functions/genGetServerSideProps';
import { useGetDoorsQuery, useRemoveDoorMutation } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function EditDoorsPage() {
  const { t } = useTranslation();
  useSetPageName(t('doors:editDoorAccess'));

  const [openDialog, setOpenDialog] = useState<string>('');

  const { data, refetch: refetchDoors } = useGetDoorsQuery();
  const [removeDoor] = useRemoveDoorMutation();
  return (
    <Stack>
      <h2>{t('doors:editDoorAccess')}</h2>
      <Paper>
        <List>
          {data?.doors?.map((door, index) => (
            <React.Fragment key={door.name}>
              <StrongConfirmDialog
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
              </StrongConfirmDialog>
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

export const getStaticProps = genGetProps(['policy', 'doors']);
