import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import ChestItem from '~/components/Chest/ChestItem';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useMyChestQuery } from '~/generated/graphql';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function MemberChest() {
  const router = useRouter();
  const studentId = router.query.id as string;
  const { data } = useMyChestQuery({ variables: { studentId } });
  useSetPageName('Din kista');
  return (
    <div>
      <PageHeader>Din kista</PageHeader>
      <Stack>
        {data?.chest?.items.map((item) => (
          <ChestItem key={item.id} item={item} />
        ))}
      </Stack>
    </div>
  );
}

export const getServerSideProps = genGetProps(['chest']);
