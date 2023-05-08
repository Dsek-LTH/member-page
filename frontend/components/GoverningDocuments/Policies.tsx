import { useGetPoliciesQuery } from '~/generated/graphql';
import Base from './Base';

export default function Policies() {
  const { data, refetch } = useGetPoliciesQuery();
  return (
    <Base translationKey="policies" governingDocuments={data?.policies ?? []} refetch={refetch} />
  );
}
