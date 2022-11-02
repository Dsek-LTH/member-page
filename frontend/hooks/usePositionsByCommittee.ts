import { usePositionsByCommitteeQuery } from '~/generated/graphql';

const usePositionsByCommittee = (committeeId?: string) => {
  const {
    data, loading, error, refetch,
  } = usePositionsByCommitteeQuery({
    variables: { committeeId },
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return {
    positions: positions || [], loading, error, refetch,
  };
};

export default usePositionsByCommittee;
