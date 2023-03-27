import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import ChestItem from '~/components/Chest/ChestItem';
import genGetProps from '~/functions/genGetServerSideProps';
import { useMyChestQuery } from '~/generated/graphql';

export default function MemberChest() {
  const router = useRouter();
  const studentId = router.query.id as string;
  const { data } = useMyChestQuery({ variables: { studentId } });
  return (
    <div>
      <h2>Din kista</h2>
      <Stack>
        {data?.chest?.items.map((item) => (
          <ChestItem key={item.id} item={item} />
        ))}
      </Stack>
    </div>
  );
}

export const getServerSideProps = genGetProps(['chest']);
