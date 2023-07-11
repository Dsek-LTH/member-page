import EditIcon from '@mui/icons-material/Edit';
import
{
  IconButton, TableCell, TableRow, TextField,
} from '@mui/material';
import React from 'react';
import LoadingButton from '~/components/LoadingButton';
import { AdminSetting, useDeleteAdminSettingMutation, useUpdateAdminSettingMutation } from '~/generated/graphql';

type Props = {
  setting: AdminSetting;
  refetch: () => Promise<any>;
};

export default function SettingTableRow({ setting, refetch }: Props) {
  const [deleteSetting] = useDeleteAdminSettingMutation({
    variables: {
      key: setting.key,
    },
  });
  const [value, setValue] = React.useState(setting.value);
  const [isEditing, setIsEditing] = React.useState(false);
  const [updateSetting] = useUpdateAdminSettingMutation({
    variables: {
      key: setting.key,
      value,
    },
  });
  return (
    <TableRow>
      <TableCell>{setting.key}</TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            autoFocus
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={async () => {
              if (value === setting.value) {
                setIsEditing(false);
                return;
              }
              await updateSetting();
              await refetch();
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            {setting.value}
            <IconButton
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </IconButton>

          </>
        )}
      </TableCell>
      <TableCell>
        <LoadingButton
          onClick={async () => {
            await deleteSetting();
            refetch();
          }}
        >
          Delete
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}
