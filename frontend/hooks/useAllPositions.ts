import { useAllPositionsQuery } from '~/generated/graphql';

const useAllPositions = () => {
  const {
    data, loading, error, refetch,
  } = useAllPositionsQuery();
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return {
    positions: positions || [], loading, error, refetch,
  };
};

export default useAllPositions;
