import { useGetMembersQuery } from "~/generated/graphql";

export const useMembers = () => {
  const { data } = useGetMembersQuery();
  const { members: membersPagination } = data || {};
  const { members } = membersPagination || {};
  return members || [];
};
