import { usePositionsByCommitteeQuery } from '~/generated/graphql';

const usePositionsByCommittee = (shortName?: string) => {
  const {
    data, loading, error, refetch,
  } = usePositionsByCommitteeQuery({
    variables: { shortName },
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return {
    positions: positions || [], loading, error, refetch,
  };
};

export default usePositionsByCommittee;
