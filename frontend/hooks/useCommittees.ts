import { useEffect, useState } from 'react';
import { GetCommitteesQuery, useGetCommitteesQuery } from '~/generated/graphql';

const styrelsen: GetCommitteesQuery['committees']['committees'][number] = {
  id: 'styr',
  name: 'Styrelsen',
};

const useCommittees = () => {
  const [committees, setCommittees] = useState<GetCommitteesQuery['committees']['committees']>([]);
  const { data, loading, error } = useGetCommitteesQuery();
  const { committees: committeesPagination } = data || {};
  useEffect(() => {
    if (committeesPagination?.committees) {
      setCommittees([styrelsen, ...committeesPagination.committees]);
    }
  }, [committeesPagination]);
  return { committees: committees || [], loading, error };
};

export default useCommittees;
