import { useGetPositionsQuery } from '~/generated/graphql';

const usePositions = (committeeId?: string) => {
  const {
    data, loading, error, refetch,
  } = useGetPositionsQuery({
    variables: { committeeId },
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return {
    positions: positions || [], loading, error, refetch,
  };
};

export default usePositions;
