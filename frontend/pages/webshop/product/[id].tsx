import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useProductQuery } from '~/generated/graphql';
import routes from '~/routes';

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const {data, refetch} = useProductQuery({variables: {id: id as string}})
    //const products = data?.products || [];
    //product = useProductQuery(id)

    return(
    <div>
        <Grid container spacing = {1}>
            <Grid item xs = {8}>
                <img 
                src = {data?.product?.imageUrl}
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
            </Grid>
        </Grid>
    </div>)

    //allt gemensamt
    //Component bereonde på kategori 
    //Component det "lagliga"
}