import React from 'react';
import ArticleSet from '../components/News/articleSet'
import Grid from '@material-ui/core/Grid';
import Calender from '../components/Calender';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import DefaultLayout from '../layouts/defaultLayout';


export default function HomePage() {
  const { t } = useTranslation('common');

  return (
    <>
      <DefaultLayout>
      <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <h2>{t('news')}</h2>
            <ArticleSet fullArticles={false} articlesPerPage={10} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <h2>{t('calendar')}</h2>
            <Calender />
          </Grid>
        </Grid>
      </DefaultLayout>
    </>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'news']),
  }
})