import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { Pagination } from '@mui/material';
import EventCard from './EventCard';
import {
  useEventsQuery,
} from '~/generated/graphql';
import ArticleSkeleton from '~/components/News/articleSkeleton';
import { sortByStartDateDescending } from '~/functions/sortByDate';

const now = DateTime.now();

export default function PassedEventSet() {
  const { t } = useTranslation('news');
  const [page, setPage] = useState(0);
  const { loading, data } = useEventsQuery({
    variables:
     { page, perPage: 10, end_datetime: now },
  });

  const router = useRouter();

  useEffect(() => {
    const pageNumberParameter = new URLSearchParams(window.location.search).get('page');
    const pageNumber = pageNumberParameter ? parseInt(pageNumberParameter, 10) : 0;
    setPage(pageNumber);
  }, []);

  const totalPages = data?.events?.pageInfo?.totalPages || 1;

  if (loading) {
    return (
      <>
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
      </>
    );
  }

  if (!data?.events) return <p>{t('failedLoadingNews')}</p>;

  return (
    <div>
      {Array.from(data?.events
        .events)
        .sort(sortByStartDateDescending)
        .map((event) =>
          (event ? (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          ) : (
            <div>{t('articleError')}</div>
          )))}
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(event, value) => {
          router.push(`/events/passed?page=${value - 1}`);
          setPage(value - 1);
        }}
      />
    </div>
  );
}
