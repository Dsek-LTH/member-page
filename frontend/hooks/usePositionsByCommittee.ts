import { usePositionsByCommitteeQuery } from '~/generated/graphql';

const usePositionsByCommittee = (shortName?: string, year?: number) => {
  const {
    data, loading, error, refetch,
  } = usePositionsByCommitteeQuery({
    variables: { shortName, year },
    fetchPolicy: 'no-cache',
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return {
    positions: positions || [], loading, error, refetch,
  };
};

export default usePositionsByCommittee;
