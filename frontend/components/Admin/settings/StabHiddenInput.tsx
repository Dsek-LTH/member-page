import { Stack, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import LoadingButton from '~/components/LoadingButton';
import { useGetAdminSettingsQuery, useSetStabHiddenPeriodMutation } from '~/generated/graphql';

export default function StabHiddenInput() {
  const { i18n } = useTranslation();
  const { data, refetch } = useGetAdminSettingsQuery();
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const adminSettings = data?.adminSettings;
  const startSetting = adminSettings?.find((setting) => setting.key === 'stab_hidden_start');
  const endSetting = adminSettings?.find((setting) => setting.key === 'stab_hidden_end');
  useEffect(() => {
    if (startSetting) {
      setStart(new Date(startSetting.value));
    }
    if (endSetting) {
      setEnd(new Date(endSetting.value));
    }
  }, [startSetting, endSetting]);

  const [setStabHiddenPeriod] = useSetStabHiddenPeriodMutation({
    variables: {
      start,
      end,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} locale={i18n.language}>
      <Stack direction="row" gap={2}>
        <DatePicker
          renderInput={(p) => <TextField fullWidth {...p} />}
          label="Start"
          value={start}
          onChange={setStart}
        />
        <DatePicker
          renderInput={(p) => <TextField fullWidth {...p} />}
          label="End"
          value={end}
          onChange={setEnd}
        />
        <LoadingButton
          onClick={async () => {
            await setStabHiddenPeriod();
            refetch();
          }}
        >
          Set
        </LoadingButton>
      </Stack>

    </LocalizationProvider>
  );
}
