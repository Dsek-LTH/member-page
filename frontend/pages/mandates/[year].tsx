import { Stack } from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import MandateList from '~/components/Mandates/MandateList';
import Stepper from '~/components/Mandates/Stepper';
import PositionsSelector from '~/components/Members/PositionsSelector';
import CreateMandate from '~/components/Positions/CreateMandate';
import { GetPositionsQuery } from '~/generated/graphql';

export default function MandatePageByYear() {
  const router = useRouter();
  const { t, i18n } = useTranslation('mandate');

  const [selectedPosition, setSelectedPosition] =
    useState<GetPositionsQuery['positions']['positions'][number]>(null);

  const year = router.query.year as string;
  const currentYear = DateTime.now().year;
  const lthOpens = 1961;
  const timeInterval = currentYear - lthOpens;

  const moveForward = () => {
    router.push('/mandates/' + (parseInt(year) - 1));
  };

  const moveBackward = () => {
    router.push('/mandates/' + (parseInt(year) + 1));
  };

  return (
    <>
      <h2 className="classes.positionName">
        {t('mandates')} {year}
      </h2>
      {lthOpens <= parseInt(year) && parseInt(year) <= currentYear ? (
        <Stack spacing={2}>
          <PositionsSelector setSelectedPosition={setSelectedPosition} />
          <CreateMandate position={selectedPosition} />
          <Stepper
            moveForward={moveForward}
            moveBackward={moveBackward}
            year={parseInt(year)}
            idx={timeInterval - (parseInt(year) - lthOpens)}
            maxSteps={timeInterval}
          ></Stepper>
          <MandateList year={year} />
        </Stack>
      ) : (
        <div>{t('mandateError')}</div>
      )}
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'mandate'])),
    },
  };
}
