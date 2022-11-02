import { useGetMandatesByPeriodQuery } from '~/generated/graphql';

export default function useMandatesByYear(year: number) {
  return useGetMandatesByPeriodQuery({
    variables: {
      page: 0,
      perPage: 1000,
      start_date: new Date(`${year}-01-01`),
      end_date: new Date(`${year}-12-31`),
    },
  });
}
