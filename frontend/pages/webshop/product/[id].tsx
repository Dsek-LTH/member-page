import { Button, Grid, MenuItem } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CartButton from '~/components/Webshop/CartButton';
import TicketForm from '~/components/Webshop/TicketForm';
import { useProductQuestionsQuery } from '~/generated/graphql';
import { useProductQuery , useMyCartQuery} from '~/generated/graphql';
import { useSnackbar } from '~/providers/SnackbarProvider';
import routes from '~/routes';

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const { data, refetch } = useProductQuery({variables: {id: id as string}})
    const {data: questions, refetch: qrefetch, error, networkStatus} = useProductQuestionsQuery({variables: {productId: id}})
    const { t } = useTranslation();
    console.log(questions, qrefetch, error)
    //const products = data?.products || [];
    //product = useProductQuery(id)

    return(
    <div>
        {data ? 
        (<Grid container spacing = {1}>
        <Grid item xs = {8}>
            <img 
            src = {data?.product?.imageUrl}
            width = "400"
            height = "400"
            />
        </Grid>
        <Grid item xs = {4}>
            <Grid item xs = {6}>
                <h1>
                    {data?.product?.name}
                </h1>
            </Grid>
            <Grid item xs = {6}>
                <h3>
                    {data?.product?.price} kr
                </h3>
            </Grid>
            <Grid item xs = {6}>
                <h3>
                    {questions?.productQuestions?.freetext}

                </h3>
            </Grid>
            <Grid item xs = {4}>
                {data?.product?.category?.id == "12fc87c7-3c4a-40f1-947a-574c9f54dbeb" ? <TicketForm></TicketForm> : <h1>not ticket</h1>}
            </Grid>
            <Grid item xs = {6}>
                <h3>
                    {data?.product?.description}
                </h3>
            </Grid>
            <Grid item xs = {6}>
                {data ?  <CartButton product={data?.product}/>  : <h1></h1>}
            </Grid>
        </Grid>
    </Grid>) : (<h2>Loading</h2>)}
    </div>
    )

    //allt gemensamt
    //Component bereonde på kategori 
    //Component det "lagliga"
}

export async function getServerSideProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'webshop'])),
      },
    };
  }