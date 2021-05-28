import React from 'react';
import { useTranslation } from 'next-i18next';
import { StaticDatePicker } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

type BookingFormProps = {
}



export default function BookingForm() {
    const { t } = useTranslation(['common']);
    const [date, setDate] = React.useState(undefined);
    const [time, setTime] = React.useState(undefined);

    return (
        <>
            <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="month"
                value={date} 
                onChange={(newValue) => {
                    setDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </>
    )
}