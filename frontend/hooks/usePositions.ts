import { useGetPositionsQuery } from "~/generated/graphql";

export const usePositions = (committeeId?: string) => {
  const { data, loading, error } = useGetPositionsQuery({
    variables: { committeeId },
  });
  const { positions: positionsPagination } = data || {};
  const { positions } = positionsPagination || {};
  return { positions: positions || [], loading, error };
};
