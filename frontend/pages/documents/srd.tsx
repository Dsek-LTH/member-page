import Browser from '~/components/FileBrowser';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  useSetPageName('SRD');
  return (
    <>
      <PageHeader>SRD</PageHeader>
      <Browser bucket="files" prefix="public/srd" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
