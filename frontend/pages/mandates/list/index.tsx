import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import DefaultLayout from "~/layouts/defaultLayout";

const query_param = {
  page: 0,
  perPage: 10,
}

export default function MandateListPage() {
  const { t, i18n } = useTranslation('mandate');
/*
  const { data, loading, error } = usePositionListPageQuery({
    variables: query_param,
  });
*/
  const loading = false;
  const error=false;

  if(loading) {
    return (
      <DefaultLayout>
        <h2>Loading</h2>;
      </DefaultLayout>
    )
  }

  if(error) {
    return (
      <DefaultLayout>
        <h2>Error</h2>;
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <h2>{ t('mandates') }</h2>
    </DefaultLayout>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'mandate']),
  }
})