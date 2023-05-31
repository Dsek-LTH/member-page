import
{
  TableCell, TableRow, TextField,
} from '@mui/material';
import React from 'react';
import LoadingButton from '~/components/LoadingButton';
import { useCreateAdminSettingMutation } from '~/generated/graphql';

export default function CreateSettingTableRow({ refetch }: { refetch: () => void }) {
  const [key, setKey] = React.useState('');
  const [value, setValue] = React.useState('');

  const [createSetting] = useCreateAdminSettingMutation({
    variables: {
      key,
      value,
    },
  });
  return (
    <TableRow>
      <TableCell>
        <TextField
          label="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <TextField
          label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <LoadingButton
          onClick={async () => {
            await createSetting();
            refetch();
          }}
        >
          Add
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}
