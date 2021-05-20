import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '~/layouts/defaultLayout';
import { Paper } from '@material-ui/core';
import { useGetBookingsQuery } from '~/generated/graphql';
import UserContext from '~/providers/UserProvider';
import BookingList from '~/components/BookingList';


export default function BookingPage() {
    const { t } = useTranslation('common');
    const { initialized } = useKeycloak<KeycloakInstance>();
    const { user, loading: userLoading } = useContext(UserContext);
    const [from, setFrom] = React.useState(Date.now());
    const [to, setTo] = React.useState(undefined);
    const [status, setStatus] = React.useState(undefined);

    const { data, loading, error } = useGetBookingsQuery({
        variables: {
            from: from,
            to: to,
            status: status,
        },
    });

    if (loading || !initialized || userLoading || !data.bookingRequests) {
        return (
            <DefaultLayout>
                <Paper>
                    Error
            </Paper>
            </DefaultLayout>
        )
    }

    return (
        <DefaultLayout>
            <h2>Bokningar</h2>
            <Paper>
                <BookingList
                    bookingItems={data.bookingRequests}
                />
            </Paper>
        </DefaultLayout>
    );
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'booking']),
    }
})
