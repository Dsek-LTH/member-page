import { useGetCommitteesQuery } from "~/generated/graphql";

export const useCommittees = () => {
  const { data } = useGetCommitteesQuery();
  const { committees: committeesPagination } = data || {};
  const { committees } = committeesPagination || {};
  return committees || [];
};
