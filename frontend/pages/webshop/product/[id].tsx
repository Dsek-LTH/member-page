import { useRouter } from 'next/router';
import routes from '~/routes';

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    //const products = data?.products || [];
    //product = useProductQuery(id)

    return(
    <h2>
        Insert product page
    </h2>)

    //allt gemensamt
    //Component bereonde på kategori 
    //Component det "lagliga"
}