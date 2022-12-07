import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { useMyChestQuery } from '~/generated/graphql';
import ChestItem from '~/components/Chest/ChestItem';

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

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['chest', 'common'])),
  },
});
