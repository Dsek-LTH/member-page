import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMyChestQuery } from '~/generated/graphql';

export default function MemberChest() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, refetch } = useMyChestQuery({ variables: { memberId: id } });
  useEffect(() => {
    refetch();
  }, []);
  return (
    <div>
      <h2>Din kista</h2>
      {data?.chest?.items.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['chest', 'common'])),
  },
});
