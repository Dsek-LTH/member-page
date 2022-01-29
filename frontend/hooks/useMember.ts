import { useMemberMandatesQuery } from '~/generated/graphql';

const useMember = (id: string) => {
  const { data, loading, error } = useMemberMandatesQuery({ variables: { id } });
  const { memberById: member } = data || {};
  return { member, loading, error };
};

export default useMember;
