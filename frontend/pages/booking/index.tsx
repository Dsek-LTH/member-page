import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '~/layouts/defaultLayout';
import { Accordion, AccordionSummary, AccordionDetails, Box, Paper, Typography, Stack } from '@material-ui/core';
import { BookingStatus } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import BookingList from '~/components/BookingTable';
import BookingForm from '~/components/BookingForm';
import { DateTime } from 'luxon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BookingFilter from '~/components/BookingFilter';
import LoadingTable from '~/components/LoadingTable';


export default function BookingPage() {
    const { t } = useTranslation(['common', 'booking']);
    const { initialized } = useKeycloak<KeycloakInstance>();
    const { user, loading: userLoading } = useContext(UserContext);
    const [from, setFrom] = React.useState(DateTime.utc());
    const [to, setTo] = React.useState(undefined);
    const [status, setStatus] = React.useState<BookingStatus>(undefined);

    const updateTabele = () => {
        setFrom(DateTime.utc());
    }

    if (!initialized || userLoading) {
        return (
            <DefaultLayout>
                <h2>{t('booking:bookings')}</h2>
                <Stack spacing={2}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{t('booking:filter')}</Typography>
                        </AccordionSummary>
                    </Accordion>
                    <Paper>
                        <LoadingTable />
                    </Paper>
                </Stack>
            </DefaultLayout>
        )
    }

    return (
        <DefaultLayout>
            <h2>{t('booking:bookings')}</h2>
            <Stack spacing={2}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{t('booking:filter')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <BookingFilter
                            from={from}
                            onFromChange={setFrom}
                        />
                    </AccordionDetails>
                </Accordion>
                <Paper>
                    <BookingList
                        from={from}
                        to={to}
                        status={status}
                        user={user}
                        onChange={updateTabele}
                    />
                </Paper>
            </Stack>
            {
                user &&
                <Box>
                    <h2>{t('booking:book')}</h2>
                    <Paper sx={{
                        padding: '1em'
                    }}>
                        <BookingForm onSubmit={updateTabele} />
                    </Paper>
                </Box>
            }

        </DefaultLayout>
    );
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'booking']),
    }
})
