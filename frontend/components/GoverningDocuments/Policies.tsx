import { useGetPoliciesQuery } from '~/generated/graphql';
import Base from './Base';

export default function Policies() {
  const { data } = useGetPoliciesQuery();
  return (
    <Base translationKey="policies" governingDocuments={data?.policies ?? []} />
  );
}
