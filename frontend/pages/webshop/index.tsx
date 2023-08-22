import { Button } from '@mui/material';
import Link from 'next/link';
import PageHeader from '~/components/PageHeader';
import Webshop from '~/components/Webshop/Webshop';
import genGetProps from '~/functions/genGetServerSideProps';
import AddFoodPreferencePopup from '~/providers/AddFoodPreferencePopup';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useUser } from '~/providers/UserProvider';

export default function WebshopPage() {
  useSetPageName('Webshop');
  const { hasAccess } = useApiAccess();
  const { user, refetch } = useUser();
  return (
    <>
      <PageHeader>Webshop</PageHeader>
      <AddFoodPreferencePopup
        id={user?.id}
        open={(user?.student_id && user?.food_preference === null)}
        refetchUser={refetch}
      />
      {hasAccess('webshop:create') && (
        <Link href="/webshop/product/create" passHref>
          <Button
            variant="contained"
            style={{
              marginBottom: '1rem',
            }}
          >
            Add product
          </Button>
        </Link>
      )}
      <Webshop />
    </>
  );
}

export const getStaticProps = genGetProps(['webshop']);
