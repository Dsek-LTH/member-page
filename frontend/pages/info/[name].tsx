import { useRouter } from 'next/router';
import MarkdownPage from '~/components/MarkdownPage';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';

export default function Info() {
  const { query } = useRouter();
  const name = query?.name as string;
  return (
    <NoTitleLayout>
      <MarkdownPage name={name} />
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news']);
