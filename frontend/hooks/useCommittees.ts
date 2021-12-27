import { useGetCommitteesQuery } from '~/generated/graphql';

const useCommittees = () => {
  const { data, loading, error } = useGetCommitteesQuery();
  const { committees: committeesPagination } = data || {};
  const { committees } = committeesPagination || {};
  return { committees: committees || [], loading, error };
};

export default useCommittees;
