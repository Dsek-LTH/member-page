import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import MyCart from '~/components/Header/components/MyCart';
import MarkdownPage from '~/components/MarkdownPage';
import PageHeader from '~/components/PageHeader';
import ProductCategories from '~/components/Webshop/ProductCategories';
import Products from '~/components/Webshop/Products';
import genGetProps from '~/functions/genGetServerSideProps';
import { ProductCategory } from '~/generated/graphql';
import AddFoodPreferencePopup from '~/providers/AddFoodPreferencePopup';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import { useIsNativeApp } from '~/providers/NativeAppProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useUser } from '~/providers/UserProvider';

export default function WebshopPage() {
  useSetPageName('Webshop');
  const { hasAccess } = useApiAccess();
  const { user, refetch } = useUser();
  const isNativeApp = useIsNativeApp();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(null);
  return (
    <Stack gap={{ xs: 1, sm: 2 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Stack alignItems="flex-start" gap={{ xs: 1, sm: 2 }}>
          <PageHeader noMargin>Webshop</PageHeader>
          <AddFoodPreferencePopup
            id={user?.id}
            open={(user?.student_id && user?.food_preference === null)}
            refetchUser={refetch}
          />
          {hasAccess('webshop:create') && (
          <Link href="/webshop/product/create" passHref>
            <Button
              variant="contained"
            >
              Add product
            </Button>
          </Link>
          )}
          <ProductCategories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Stack>
        {isNativeApp && <MyCart />}
      </Stack>
      <Products categoryId={selectedCategory?.id} />
      <MarkdownPage name="webshop" />
    </Stack>
  );
}

export const getStaticProps = genGetProps(['webshop']);
