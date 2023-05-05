import { useRouter } from 'next/router';
import MarkdownPage from '~/components/MarkdownPage';
import NoTitleLayout from '~/components/NoTitleLayout';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Info() {
  const { query } = useRouter();
  const name = query?.name as string;
  useSetPageName(name.substring(0, 1).toUpperCase() + name.substring(1));
  return (
    <NoTitleLayout>
      <MarkdownPage name={name} />
    </NoTitleLayout>
  );
}

export const getServerSideProps = genGetProps(['news']);
