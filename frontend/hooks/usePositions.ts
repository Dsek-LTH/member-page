import { useGetPositionsQuery } from "~/generated/graphql";

export const usePositions = (committeeId?: number) => {
  const { data, loading } = useGetPositionsQuery({
    variables: { committeeId },
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return loading ? { positions: [], loading } : { positions, loading };
};
