import Browser from '~/components/FileBrowser';
import genGetProps from '~/functions/genGetServerSideProps';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function DocumentPage() {
  useSetPageName('SRD');
  return (
    <>
      <h2>SRD</h2>
      <Browser bucket="files" prefix="public/srd" />
    </>
  );
}

export const getStaticProps = genGetProps(['fileBrowser']);
