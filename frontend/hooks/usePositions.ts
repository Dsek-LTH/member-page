import { useGetPositionsQuery } from "~/generated/graphql";

export const usePositions = (committeeId?: string) => {
  const { data, loading } = useGetPositionsQuery({
    variables: { committeeId },
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return loading
    ? { positions: [], loading }
    : { positions: positions || [], loading };
};
