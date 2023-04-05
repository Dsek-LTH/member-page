import
{
  Button,
  CircularProgress,
  MenuItem, Paper, Select, Stack, TextField, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import genGetProps from '~/functions/genGetServerSideProps';
import { usePositionQuery, useUpdatePositionMutation } from '~/generated/graphql';
import useCommittees from '~/hooks/useCommittees';
import { useApiAccess } from '~/providers/ApiAccessProvider';

export default function EditPosition() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = usePositionQuery({ variables: { id: id.toString() } });
  const { committees } = useCommittees();

  const position = data?.positions?.positions[0];
  const [name, setName] = useState(position?.name ?? '');
  const [nameEn, setNameEn] = useState(position?.nameEn ?? '');
  const [description, setDescription] = useState(position?.description ?? '');
  const [descriptionEn, setDescriptionEn] = useState(position?.descriptionEn ?? '');
  const [email, setEmail] = useState(position?.email ?? '');
  const [committee, setCommittee] = useState(position?.committee?.id ?? '');

  const [updatePosition] = useUpdatePositionMutation();
  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {
    setIsLoading(true);
    await updatePosition({
      variables: {
        id: position.id,
        name,
        nameEn,
        description,
        descriptionEn,
        email,
        committee_id: committee,
      },
    });
    setIsLoading(false);
  };

  const { hasAccess } = useApiAccess();

  useEffect(() => {
    if (position) {
      setName(position.name);
      setNameEn(position.nameEn);
      setDescription(position.description);
      setDescriptionEn(position.descriptionEn);
      setEmail(position.email);
      setCommittee(position.committee.id);
    }
  }, [position]);
  if (loading) return null;
  if (!data || !position) return <div>Position not found</div>;
  if (!hasAccess('core:position:update')) return <div>Access denied</div>;
  return (
    <Paper sx={{ p: 4 }}>
      <Stack gap={2}>
        <Typography variant="h4" mb={2}>
          Redigera
          {' '}
          {position.name}
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Name (En)"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <TextField
          multiline
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          multiline
          label="Description (En)"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Comittee selector */}
        <Select
          label="Committee"
          value={committee}
          onChange={(e) => setCommittee(e.target.value)}
        >
          {committees.map((com) => (
            <MenuItem key={com.id} value={com.id}>
              {com.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          onClick={save}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Spara'}
        </Button>
      </Stack>
    </Paper>
  );
}

export const getServerSideProps = genGetProps(['position']);
