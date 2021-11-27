import { useGetMandatesByPeriodQuery } from "~/generated/graphql";

export const useCurrentMandates = () => {
  const thisYear = new Date().getFullYear();
  const { data, refetch } = useGetMandatesByPeriodQuery({
    variables: {
      page: 0,
      perPage: 100,
      start_date: new Date(thisYear, 0, 1),
      end_date: new Date(thisYear, 12, 31),
    },
  });
  const { mandates: mandatesPagination } = data || {};
  const { mandates } = mandatesPagination || {};
  return mandates
    ? { mandates, refetchMandates: refetch }
    : {
        mandates: [],
        refetchMandates: refetch,
      };
};
