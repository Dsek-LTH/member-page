import { Card, CardContent } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React from "react";
import DefaultLayout from "~/layouts/defaultLayout";

const query_param = {
  page: 0,
  perPage: 10,
}

export default function MandatePageByYear() {
  const router = useRouter()
  const year = router.query.year as string;
  const { t, i18n } = useTranslation('mandate');

  const start_date = new Date(parseInt(year), 12, 1);
  const end_date = new Date(parseInt(year)+1, 12, 1);


/*
  const { data, loading, error } = useMandateListPageQuery({
    variables: { ...query_param,
                  start_date: start_date,
                  end_date: end_date,
                },
  });
*/
  const loading = false;
  const error = false;

  if(loading) {
    return (
      <h2>Loading</h2>
    )
  }

  if(error) {
    return (
      <h2>Error</h2>
    )
  }
  return (
    <DefaultLayout>
      <h2>{ t('mandates') } {year}</h2>
      <h6>{ start_date.toISOString() }</h6>
      <h6>{ end_date.toISOString() }</h6>
    </DefaultLayout>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'mandate']),
    }
  }
}