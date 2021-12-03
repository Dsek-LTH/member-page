import { useGetMembersQuery } from "~/generated/graphql";

export const useMembers = () => {
  const { data, loading, error } = useGetMembersQuery();
  const { members: membersPagination } = data || {};
  const { members } = membersPagination || {};
  return { members: members || [], loading, error };
};
