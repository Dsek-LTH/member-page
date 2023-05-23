import { useGetGuidelinesQuery } from '~/generated/graphql';
import Base from './Base';

export default function Guidelines() {
  const { data, refetch } = useGetGuidelinesQuery();
  return (
    <Base translationKey="guidelines" governingDocuments={data?.guidelines} refetch={refetch} />
  );
}
