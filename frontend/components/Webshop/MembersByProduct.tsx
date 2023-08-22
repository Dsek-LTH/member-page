import { Stack, Typography } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { GetMembersByProductQuery, useGetMembersByProductQuery } from '~/generated/graphql';
import LoadingButton from '../LoadingButton';

const columns = [
  'First Name',
  'Last Name',
  'Student ID',
  'Food Preference',
  'Variant',
  'Consumed At',
  'Paid At',
];

const options = {
  filterType: 'checkbox',
};

function createDataItem(item: GetMembersByProductQuery['getMembersByProduct'][number]) {
  return [
    item.member.first_name,
    item.member.last_name,
    item.member.student_id,
    item.member.food_preference,
    item.userInventoryItem.variant,
    item.userInventoryItem.consumedAt,
    item.userInventoryItem.paidAt,
  ];
}

export default function MembersByProduct({ productId }: { productId: string }) {
  const { data: graphqlData, refetch } = useGetMembersByProductQuery({
    variables: {
      productId,
    },
  });
  const data = graphqlData?.getMembersByProduct.map(createDataItem) ?? [
    'Loading...',
  ];
  return (
    <Stack spacing={1}>
      <h2>Members by product</h2>
      <Typography>
        Total purchases:
        {' '}
        {graphqlData?.getMembersByProduct.length}
      </Typography>
      <LoadingButton onClick={async () => {
        await refetch();
      }}
      >
        Reload data
      </LoadingButton>
      <MUIDataTable
        title="Members with this item in their inventory"
        data={data}
        columns={columns}
        options={options}
      />
    </Stack>
  );
}
