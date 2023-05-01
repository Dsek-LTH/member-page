import { useGetGuidelinesQuery } from '~/generated/graphql';
import Base from './Base';

export default function Guidelines() {
  const { data } = useGetGuidelinesQuery();
  return (
    <Base translationKey="guidelines" governingDocuments={data?.guidelines} />
  );
}
