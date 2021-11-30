import { Typography, Container, Link } from '@material-ui/core';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/defaultLayout';

export async function getStaticProps({ locale }) {
    const res = await fetch('https://api.kanye.rest/')
    const json = await res.json()

    return {
        props: { quote: json.quote, ...(await serverSideTranslations(locale, ['common'])), },
    }
}

export default function Error({ quote }) {
    const { t } = useTranslation('common');
    return (
        <DefaultLayout>
            <Container maxWidth="md">
                <Stack spacing={4} direction="column" height="100%" alignItems="center" alignContent="center">
                    <Typography variant="h1">404</Typography>
                    <Typography variant="subtitle1" component="p">
                        Oops... du försökte komma åt en sida som inte finns! Om du klickade du på en länk är vi tacksamma ifall du kontaktar <Link color="inherit" underline="always" component="a" href="mailto:dwww@dsek.se?subject=Broken link">dwww@dsek.se</Link> så vi kan fixa den.
                    </Typography>
                    <Container maxWidth="sm" style={{
                        marginTop: '4rem',
                    }}>
                        <Typography variant="h5" component="p" align="center">"{quote}"</Typography>
                        <Typography variant="h6" component="p" align="right" style={{
                            margin: '0.5rem 5rem',
                        }}>
                            - Ye
                        </Typography>
                    </Container>
                </Stack>
            </Container>
        </DefaultLayout>
    )
}